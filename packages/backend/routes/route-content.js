import express from 'express'
import { LISTS, TEMPLATES } from '@this/shared/constants.js'
import { controller, joi, mw } from '#root/index.js'



// -----------------
// Data
// -----------------

const lists = Object.keys(LISTS);
const router = express.Router();



// -----------------
// Routes
// -----------------

router.get('/routes', mw.cache('routes'), controller(async ({ locale, db }) => {

    return db('routes')
        .leftJoin('translations AS t1', 't1.id', 'routes.path')
        .leftJoin('translations AS t2', 't2.id', 'routes.title')
        .select([
            'routes.name',
            `t1.${locale} as path`,
            `t2.${locale} as title`
        ]);

}))



// -----------------
// Templates
// -----------------

router.get('/templates', mw.cache('templates'), controller(async ({ locale, db }) => {

    return db('templates')
        .leftJoin('translations', 'translations.id', 'templates.body')
        .whereIn('templates.key', TEMPLATES)
        .select([
            'templates.key',
            `translations.${locale} as body`
        ]);

}))



// -----------------
// Lists
// -----------------

router.get('/lists/:list', mw.cache(req => req.params.list), controller(async ({ params, locale, db }) => { // !!!

    const { list } = joi.check(params, {
        list: joi.string().valid(...lists).required()
    });

    const { sort, data, alias, translation } = LISTS[list];
    const query = db(list).select(`${list}.id AS value`);
    if (data) query.select(`${list}.data`);
    if (alias) query.select(`${list}.alias`);
    if (translation) query.innerJoin('translations', 'translations.id', `${list}.value`).select(`translations.${locale} AS text`);
    else query.select('value AS text');
    if (sort) query.orderBy('sort');
    else query.orderBy('text');

    return query;

}))



// -----------------
// Texts
// -----------------

router.get('/texts', mw.cache('texts_translations'), controller(async ({ query, locale, db }) => {

    const { components } = joi.check(query, {
        components: joi.array().items(joi.string()).required()
    });

    return db('texts_translations AS texts')
        .leftJoin('translations', 'translations.id', 'texts.translation')
        .whereIn('texts.component', components)
        .select([
            'texts.key',
            'texts.component',
            `translations.${locale} AS translation`
        ])

}))



// -----------------
// Plans
// -----------------

router.get('/plans', mw.cache('plans'), controller(async ({ locale, db }) => {

    return db('plans')
        .innerJoin('plans_prices AS prices', ctx => {
            ctx.on('prices.plan', 'plans.id');
            ctx.on('prices.active', db.raw('?', true));
        })
        .innerJoin('plans_features AS features', 'features.plan', 'plans.id')
        .innerJoin('translations AS t1', 't1.id', 'plans.title')
        .innerJoin('translations AS t2', 't2.id', 'plans.description')
        .innerJoin('translations AS t3', 't3.id', 'features.title')
        .orderBy('plans.sort', 'features.sort')
        .groupBy('plans.id', 't1.id', 't2.id')
        .select([
            'plans.id',
            `t1.${locale} AS title`,
            `t2.${locale} AS description`,
            db.raw(`JSONB_AGG(DISTINCT JSONB_BUILD_OBJECT('title', t3.${locale}, 'sort', features.sort)) as features`),
            db.raw(`JSONB_AGG(DISTINCT JSONB_BUILD_OBJECT('id', prices.id, 'annual', prices.annual, 'amount', prices.amount)) as prices`),
        ])

}))



// -----------------
// Home Locations
// -----------------

router.get('/locations', mw.cache('home_locations'), controller(async ({ locale, db }) => {

    return db('home_locations AS locations')
        .leftJoin('translations', 'translations.id', 'locations.title')
        .orderBy('locations.sort')
        .select([
            'locations.id',
            'locations.image',
            `translations.${locale} AS title`
        ])
        .selectJSON('geometry', [
            'ST_Y(locations.geometry) AS lat',
            'ST_X(locations.geometry) AS lng',
        ])

}))



// -----------------
// FAQ
// -----------------

router.get('/faq', mw.cache('faq'), controller(async ({ locale, db }) => {

    return db('faq')
        .innerJoin('translations AS t1', 't1.id', 'faq.question')
        .innerJoin('translations AS t2', 't2.id', 'faq.answer')
        .orderBy('faq.sort')
        .select([
            'faq.id',
            `t1.${locale} AS question`,
            `t2.${locale} AS answer`,
        ])

}))



// -----------------
// Settings
// -----------------

router.get('/settings', mw.cache('settings'), controller(async ({ locale, db }) => {
    return db('settings')
        .first()
        .innerJoin('translations', 'translations.id', 'settings.meta_description')
        .select([
            'project_name',
            `translations.${locale} AS meta_description`
        ])
}))



// -----------------
// URL
// -----------------

router.get('/url', controller(async ({ query, routes }) => {
    const { name, ...options } = query;
    const url = routes.resolve(name, options);
    return { url }
}))



// -----------------
// Errors
// -----------------

router.get('/errors', mw.cache('errors'), controller(async ({ locale, db }) => {
    return db('errors')
        .innerJoin('translations', 'translations.id', 'errors.message')
        .select([
            'errors.code',
            'errors.status',
            `translations.${locale} AS message`
        ])
        .whereIn('errors.code', [
            'INTERNAL_SERVER_ERROR',
            'DEPRECATED',
            'FORBIDDEN',
            'NOT_FOUND'
        ])
}))



// -----------------
// Features
// -----------------

router.get('/features', mw.cache('features'), controller(async ({ locale, query, db }) => {

    const { keys } = joi.check(query, {
        keys: joi.array().items(joi.string()).required()
    });

    return db('feature_items')
        .innerJoin('translations', 'translations.id', 'feature_items.text')
        .whereIn('feature_items.feature', keys)
        .select([
            'feature_items.id',
            'feature_items.feature',
            'feature_items.available',
            `translations.${locale} AS text`
        ])

}))



// -----------------
// Exports
// -----------------

export default router;