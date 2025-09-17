import express from 'express'
import { Exception, controller, schemas, joi, mw } from '#root/index.js'




// -----------------
// Data
// -----------------

const router = express.Router();

const schema = {
    place_id: joi.string().required()
}



// -----------------
// List
// -----------------

router.get('/', mw.role('company', 'member'), controller(async ({ query, locale, db }) => {

    const { limit, page } = joi.check(query, schemas.pager, { required: false });

    return db('locations')
        .query('locations', 'filter')
        .pager(page, limit)
        .newest()
        .select([
            'locations.id',
            `locations.address_${locale} AS address`
        ])

}))



// -----------------
// Count
// -----------------

router.get('/count', mw.role('company', 'member'), controller(async ({ db }) => {

    return db('locations')
        .query('locations', 'filter')
        .$count();

}))



// -----------------
// Item
// -----------------

router.get('/:id', mw.role('company', 'member'), controller(async ({ params, locale, db }) => {

    const { id } = joi.check(params, schemas.id);

    return db('locations')
        .query('locations', 'filter')
        .pk(id)
        .select([
            'locations.id',
            `locations.address_${locale} AS address`
        ])
        .selectJSON('geometry', [
            'ST_Y(geometry) AS lat',
            'ST_X(geometry) AS lng',
        ])

}))



// -----------------
// Create
// -----------------

router.post('/', mw.role('company'), controller(async ({ body, places, user, company, locale, db }) => {

    const { place_id } = joi.check(body, schema);
    const plan = await db('v_plans').where({ company }).first();

    if (!plan?.value) {
        const count = await db('locations').query('locations', 'filter').$count();
        if (count) throw new Exception('UNPAID');
    }

    const location = await places.location(place_id);
    location.users = [user];
    location.company = company;

    return db('locations').$insert(location, [`address_${locale} AS address`])

}))



// -----------------
// Update
// -----------------

router.patch('/:id', mw.role('company'), controller(async ({ body, params, places, db }) => {

    const { id } = joi.check(params, schemas.id);
    const { place_id } = joi.check(body, schema);

    const exists = await db('locations').query('locations', 'filter').pk(id).$exists();
    if (!exists) throw new Exception('NOT_FOUND');

    const location = await places.location(place_id);

    return db('locations')
        .pk(id)
        .$update(location)

}))



// -----------------
// Delete
// -----------------

router.delete('/:id', mw.role('company'), controller(async ({ params, db }) => {

    const { id } = joi.check(params, schemas.id);
    const exists = await db('locations').query('locations', 'filter').pk(id).$exists();
    if (!exists) throw new Exception('NOT_FOUND');

    return db('locations')
        .pk(id)
        .$update({ archived: true });

}))



// -----------------
// Exports
// -----------------

export default router;