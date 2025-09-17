import express from 'express'
import { ROLES, FILES, FOLDERS } from '@this/shared/constants.js'
import { controller, joi } from '#root/index.js'



// -----------------
// Data
// -----------------

const router = express.Router();



// -----------------
// Get
// -----------------

router.get('/', controller(async ({ locale, user, role, db }) => {

    const query = db('users')
        .pk(user)
        .select([
            'users.id',
            'users.avatar',
            'users.first_name',
            'users.last_name',
            'users.email',
            'users.phone'
        ])

    if (role === ROLES.candidate) {
        query
            .leftJoin('users_languages', 'users_languages.user', 'users.id')
            .leftJoin('locations', 'locations.id', 'users.residence')
            .groupBy([
                'users.id',
                'locations.id'
            ])
            .select([
                'users.gender',
                'users.education_field',
                'users.education_level',
                'users.cv',
                `locations.address_${locale} AS residence`,
                db.raw('ARRAY_REMOVE(ARRAY_AGG(users_languages.language), NULL) AS languages')
            ])
    }

    return query;

}))



// -----------------
// Patch
// -----------------

router.patch('/', controller(async ({ body, user, role, db, places }) => {

    const schema = {
        first_name: joi.string(),
        last_name: joi.string(),
        email: joi.string().email().lowercase(),
        phone: joi.string().allow(null),
    }

    if (role === ROLES.candidate) {
        Object.assign(schema, {
            cv: joi.string().guid().allow(null),
            gender: joi.number().natural(),
            education_level: joi.number().natural().allow(null),
            education_field: joi.number().natural().allow(null),
            languages: joi.array().items(joi.number().natural()),
            place_id: joi.string().allow(null),
        })
    }

    const { place_id, ...input } = joi.check(body, schema);

    if (place_id !== undefined) {
        await db('locations').where('id', db('users').select('residence').pk(user)).del();
        if (place_id) {
            const location = await places.location(place_id);
            const { id } = await db('locations').$insert(location);
            input.residence = id;
        }
    }

    return db('users').pk(user).$update(input);

}))



// -----------------
// Image
// -----------------

router.post('/image', controller(async ({ user, files, db }) => {

    const { size, extensions } = FILES.avatar;
    const { avatar } = await db('users').pk(user).select('avatar');

    const { id } = await files.upload({
        size, extensions,
        folder: FOLDERS.users
    });

    await db('users').pk(user).$update({ avatar: id });

    if (avatar) {
        await files.remove(avatar);
    }

    return { id }

}))



// -----------------
// Exports
// -----------------

export default router;