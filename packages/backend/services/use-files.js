import path from 'path'
import sharp from 'sharp'
import Busboy from 'busboy'
import mime from 'mime-types'
import { v4 as uuid } from 'uuid'
import { Storage } from '@google-cloud/storage'
import { FOLDERS } from '@this/shared/constants.js'
import { Exception, joi } from '#root/index.js'

const { GCS_DIR, GCS_BUCKET, GCS_KEYFILE } = process.env;
const storage = new Storage({ keyFilename: GCS_KEYFILE });
const bucket = storage.bucket(GCS_BUCKET);

export default function ({ req, res, db, user }) {



    // -------------------
    // Count
    // -------------------

    async function count ({ max, count }) {
        if (max && await count() >= max) throw new Exception('INVALID_FILES_NUMBER', { max });
    }

    function isImage (mimeType) {
        return /^image\//.test(mimeType);
    }

    function resize (size, fit) {
        return sharp()
            .resize({ width: size, height: size, fit, withoutEnlargement: true })
            .jpeg({ quality: 80 })
    }



    // -------------------
    // Write
    // -------------------

    async function write (file, { filename, mimeType }, options) {

        const { size, extensions, folder } = options;
        const mimeTypes = extensions.map(mime.lookup);
        if (!mimeTypes.includes(mimeType)) throw new Exception('INVALID_FILE_TYPE', { extensions });
        if (!filename) throw new Exception('INVALID_FILE');

        const id = uuid();
        const { ext = '.' + mime.extension(mimeType), name: title } = path.parse(filename)
        const filename_disk = `${id}${ext}`;
        const resizable = isImage(mimeType);
        let filesize = 0;

        const payload = {
            id,
            title,
            filename_disk,
            folder,
            uploaded_by: user,
            type: mimeType,
            filename_download: filename,
        }

        const optimize = resizable && resize(2000, 'inside')
            .on('info', info => {
                payload.height = info.height;
                payload.width = info.width;
            })

        try {

            await count(options); // check before writing a file

            await new Promise((resolve, reject) => {
                const stream = bucket.file(`${GCS_DIR}/${filename_disk}`).createWriteStream();
                stream.on('finish', resolve);
                stream.on('error', reject);
                file.on('error', reject);
                file.on('data', data => filesize += data.length);
                file.on('limit', () => reject(new Exception('INVALID_FILE_SIZE', { max: size })));
                if (resizable) {
                    optimize.on('error', reject);
                    file.pipe(optimize).pipe(stream);
                }
                else file.pipe(stream);
            })

            payload.filesize = filesize;
            await count(options); // check before writing a row
            await db('files').$insert(payload);
            return payload;

        }

        catch (error) {
            const file = bucket.file(`${GCS_DIR}/${filename_disk}`);
            const [exists] = await file.exists();
            if (exists) await file.delete();
            throw error;
        }

    }



    // -------------------
    // Pipe
    // -------------------

    function upload (config) {

        const options = joi.check(config, {
            folder: joi.string().required().valid(...Object.values(FOLDERS)),
            size: joi.number().natural().required(),
            extensions: joi.array().items(joi.string()).required(),
            max: joi.number().natural(),
            count: joi.function().when('max', {
                is: joi.exist(),
                then: joi.required(),
                otherwise: joi.forbidden()
            })
        });

        return new Promise((resolve, reject) => {

            let files = false;

            const busboy = Busboy({
                headers: req.headers,
                limits: { files: 1, fileSize: options.size * 1024 * 1024 }
            })

            busboy.on('file', (name, file, info) => {
                files = true;
                write(file, info, options).then(resolve).catch(error => {
                    file.resume();
                    reject(error);
                });
            });

            busboy.on('close', () => {
                if (!files) reject(new Exception('INVALID_FILE'));
            });

            busboy.on('error', reject);
            req.pipe(busboy);

        })
    }



    // -------------------
    // Read
    // -------------------

    async function read (id, config) {

        const { size, download } = joi.check(config, {
            size: joi.number().natural().valid(256, 512),
            download: joi.boolean().default(false)
        }, { required: false });

        const record = await db('files').select('filename_disk', 'filename_download', 'type').pk(id);
        if (!record) throw new Exception('NOT_FOUND');

        const original = bucket.file(`${GCS_DIR}/${record.filename_disk}`);
        const [exists] = await original.exists();
        if (!exists) throw new Exception('NOT_FOUND');

        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        if (download) res.setHeader('Content-Disposition', `attachment; filename="${record.filename_download}"`);

        if (size) {

            const resizable = isImage(record.type);
            if (!resizable) throw new Exception('INVALID_FILE_TYPE');
            const { name, ext } = path.parse(record.filename_disk);
            const resized = bucket.file(`${GCS_DIR}/${name}__${size}${ext}`);
            const [exists] = await resized.exists();

            if (!exists) {
                await new Promise((resolve, reject) => {
                    const optimize = resize(size, 'outside')
                    const write = resized.createWriteStream();
                    const read = original.createReadStream();
                    read.pipe(optimize).pipe(write);
                    write.on('finish', resolve);
                    read.on('error', reject);
                    write.on('error', reject);
                    optimize.on('error', reject);
                })
            }

            await new Promise((resolve, reject) => {
                const read = resized.createReadStream();
                read.pipe(res);
                read.on('finish', resolve);
                read.on('error', reject);
            })

        }
        else {
            await new Promise((resolve, reject) => {
                const read = original.createReadStream();
                read.pipe(res);
                read.on('finish', resolve);
                read.on('error', reject);
            })
        }

        return true;

    }



    // -------------------
    // Remove
    // -------------------

    async function remove (id) {

        const success = await db('files').where({ id }).$delete();
        if (!success) throw new Exception('NOT_FOUND');

        const [files] = await bucket.getFiles({ prefix: `${GCS_DIR}/${id}` });
        await Promise.all(files.map(file => file.delete()));

        return true;

    }



    // -------------------
    // Exports
    // -------------------

    return {
        upload,
        read,
        remove
    }



}