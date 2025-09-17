import express from 'express'
import { FILES, MBO, FOLDERS } from '@this/shared/constants.js'
import { Exception, controller, joi, schemas, mw } from '#root/index.js'



// -----------------
// Data
// -----------------

const router = express.Router();

const schema = {
    job: joi.number().natural().default(null)
}



// -----------------
// Middlewares
// -----------------

router.use(mw.role('company', 'member'));



// -----------------
// Get Images
// -----------------

router.get('/:job?', controller(async ({ params, db }) => {

    const { job } = joi.check(params, schema);

    return db('files')
        .query('files', 'filter', { job })
        .orderBy('files.uploaded_on')
        .select([
            'files.id',
            'files.filename_download'
        ])

}))



// -----------------
// Upload image
// -----------------

router.post('/:job?', controller(async ({ params, files, db }) => {

    const { size, extensions, max } = FILES.jobs;
    const { job } = joi.check(params, schema);

    if (job) {
        const exists = await db('jobs').query('jobs', 'filter').pk(job).$exists();
        if (!exists) throw new Exception('NOT_FOUND')
    }

    const { id, filename_download } = await files.upload({
        size, extensions, max,
        folder: FOLDERS.jobs,
        count () {
            return db('files').query('files', 'filter', { job }).$count()
        }
    });

    if (job) await db('jobs_images').$insert({ job, image: id })
    return { id, filename_download  }

}))



// -----------------
// Exports
// -----------------

export default router;