import express from 'express'
import { isUndefined } from 'lodash-es'
import { ROLES } from '@this/shared/constants.js'
import { Exception, controller, schemas, joi, rules } from '#root/index.js'



// -----------------
// Data
// -----------------

const router = express.Router();

const schema = {
    read: joi.boolean(),
    archived: joi.boolean().default(false)
}



// -----------------
// List
// -----------------

router.get('/', controller(async ({ type, query, db }) => {

    const { page, limit, ...filter } = joi.check(query, {
        ...schema,
        ...schemas.pager,
    }, { required: false })

    const unread = db('messages')
        .query('messages', 'filter', { read: false })
        .groupBy('messages.room')
        .select('messages.room')
        .count('messages.id AS count')

    return db('rooms')
        .with('unread', unread)
        .leftJoin('unread', 'unread.room', 'rooms.id')
        .relation('rooms', 'applications')
        .query('rooms', 'filter', filter)
        .orderBy('rooms.messaged_at', 'desc')
        .pager(page, limit)
        .fields('rooms', 'item')
        .select([
            'rooms.messaged_at',
            'applications.status',
            'unread.count AS unread',
            `rooms.${type}_archived AS archived`
        ])

}))



// -----------------
// Count
// -----------------

router.get('/count', controller(async ({ query, db }) => {

    const filter = joi.check(query, schema, { required: false })

    return db('rooms')
        .query('rooms', 'filter', filter)
        .$count()

}))



// -----------------
// Name
// -----------------

router.get('/name', controller(async ({ query, role, user, company, db }) => {

    const schemaCandidate = {
        candidate: joi.forbidden().default(user),
        company: joi.number().natural(),
        job: joi.number().natural().when('company', {
            is: joi.exist(),
            then: joi.forbidden().default(null),
            otherwise: joi.required()
        }),
    }

    const schemaCompany = {
        candidate: rules.uuid,
        company: joi.forbidden().default(company),
        job: joi.number().natural().default(null),
    }

    const schema = role === ROLES.candidate ? schemaCandidate : schemaCompany;
    const input = joi.check(query, schema);

    if (input.company === undefined) {
        const job = await db('jobs').relation('jobs', 'locations').pk(input.job).select('locations.company');
        if (!job) throw new Exception('NO_REFERENCE');
        input.company = job.company;
    }

    const exists = await db('rooms')
        .where(input)
        .select('id')
        .first()

    return exists ?? input;

}))



// -----------------
// Item
// -----------------

router.get('/:id', controller(async ({ params, db }) => {

    const { id } = joi.check(params, schemas.id);

    return db('rooms')
        .query('rooms', 'filter')
        .fields('rooms', 'details')
        .pk(id)

}))



// -----------------
// Update
// -----------------

router.patch('/:id', controller(async ({ params, body, db, type }) => {

    const { id } = joi.check(params, schemas.id);
    const input = joi.check(body, {
        archived: joi.boolean()
    });

    const exists = await db('rooms').query('rooms', 'filter').pk(id).$exists();
    if (!exists) throw new Exception('NOT_FOUND');

    if (!isUndefined(input.archived)) {
        input[`${type}_archived`] = input.archived;
        delete input.archived;
    }

    return db('rooms').pk(id).$update(input);

}))



// -----------------
// Exports
// -----------------

export default router;