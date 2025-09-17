import express from 'express'
import bcrypt from 'bcrypt'
import { nanoid } from 'nanoid'
import { v4 as uuid } from 'uuid'
import { ROLES } from '@this/shared/constants.js'
import { Exception, controller, schemas, joi, jwt, md5, mw } from '#root/index.js'



// -----------------
// Data
// -----------------

const router = express.Router();

const filter = {
    members: true
};

const schema = {
    locations: joi.array().items(joi.number().natural()).min(1).required()
}



// -----------------
// Get locations
// -----------------

const checkLocations = ({ db }) => async (locations) => {

    const valid = await db('locations')
        .query('locations', 'filter', { archived: null })
        .whereIn('locations.id', locations)
        .select('locations.id');

    if (valid.length !== locations.length) {
        throw new Exception('NO_REFERENCE');
    }

}



// -----------------
// Middlewares
// -----------------

router.use(mw.role('company'));
router.use(mw.use({ checkLocations }));



// -----------------
// List
// -----------------

router.get('/', controller(async ({ query, db }) => {

    const { page, limit } = joi.check(query, schemas.pager, { required: false });

    return db('users')
        .pager(page, limit)
        .query('users', 'filter', filter)
        .fields('users', 'member')
        .orderBy('users.first_name')

}))



// -----------------
// Count
// -----------------

router.get('/count', controller(async ({ db }) => {

    return db('users')
        .query('users', 'filter', filter)
        .$count()

}))



// -----------------
// Item
// -----------------

router.get('/:id', controller(async ({ params, db }) => {

    const { id } = joi.check(params, schemas.uuid);

    return db('users')
        .pk(id)
        .relation('users', 'users_locations')
        .query('users', 'filter', filter)
        .fields('users', 'member')
        .groupBy('users.id')
        .selectRaw('ARRAY_REMOVE(ARRAY_AGG(users_locations.location), NULL) AS locations')

}))



// -----------------
// Create
// -----------------

router.post('/', controller(async ({ body, user, company, locale, mails, db, checkLocations }) => {

    const input = joi.check(body, {
        ...schema,
        first_name: joi.string().required(),
        last_name: joi.string().required(),
        email: joi.string().email().lowercase().required(),
    })

    const sender = await db('users')
        .innerJoin('companies', 'companies.id', 'users.company')
        .pk(user)
        .select([
            'users.first_name',
            'users.last_name',
            'companies.name AS company'
        ]);

    const id = uuid();
    const password = await bcrypt.hash(nanoid(64), 13);
    const { first_name, last_name, email, locations } = input;
    await checkLocations(locations)

    await db('users').$insert({
        id,
        locale,
        first_name,
        last_name,
        email,
        password,
        company,
        status: 'active',
        role: ROLES.member,
        locations
    })

    const hash = md5.hash(password);
    const token = jwt.sign({ email, hash }, '1d');

    await mails.send('INVITE_MEMBER', {
        to: email,
        data: {
            token,
            sender,
            name: first_name
        }
    })

    return { id }

}))



// -----------------
// Update
// -----------------

router.patch('/:id', controller(async ({ body, params, db, checkLocations }) => {

    const { id } = joi.check(params, schemas.uuid)
    const { locations } = joi.check(body, schema);

    const member = await db('users')
        .query('users', 'filter', filter)
        .pk(id)
        .$exists();

    if (!member) {
        throw new Exception('NOT_FOUND');
    }

    await checkLocations(locations);
    return db('users').pk(id).$update({ locations });

}))



// -----------------
// Delete
// -----------------

router.delete('/:id', controller(async ({ params, db }) => {

    const { id } = joi.check(params, schemas.uuid);

    return db('users')
        .query('users', 'filter', filter)
        .pk(id)
        .$delete();

}))



// -----------------
// Exports
// -----------------

export default router;