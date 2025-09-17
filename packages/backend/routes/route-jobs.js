import express from 'express'
import { omit, pick } from 'lodash-es'
import { FILTERS_JOBS, MAP_MAX_ZOOM, MAP_MIN_ZOOM } from '@this/shared/constants.js'
import { Exception, controller, schemas, joi, mw } from '#root/index.js'



// -----------------
// Data
// -----------------

const router = express.Router();

const schemaSort = {
    sort: joi.number().valid(1, 2, 3, 4)
}

const schemaFilter = {
    search: joi.string(),
    branch: joi.number().natural(),
    education_field: joi.number().natural(),
    education_level: joi.number().natural(),
    education_path: joi.number().natural(),
    language: joi.number().natural(),
    date: joi.date().iso(),
    origin: joi.object({
        lat: joi.number().max(90).min(-90).required(),
        lng: joi.number().max(180).min(-180).required(),
    }),
    distance: joi.number().natural().when('origin', {
        is: joi.exist(),
        then: joi.optional(),
        otherwise: joi.forbidden()
    }),
    location: joi.object({
        lat: joi.number().max(90).min(-90).required(),
        lng: joi.number().max(180).min(-180).required(),
    }).when('origin', {
        is: joi.exist(),
        then: joi.forbidden(),
        otherwise: joi.optional()
    })
}

const schemaMap = {
    zoom: joi.number().min(MAP_MIN_ZOOM).max(MAP_MAX_ZOOM).required(),
    bounds: joi.array().length(4).required().ordered(
        joi.number().min(-180).max(180), // min lng
        joi.number().min(-90).max(90),  // min lat
        joi.number().min(-180).max(180), // max lng
        joi.number().min(-90).max(90) // max lat
    )
}



// -----------------
// Middlewares
// -----------------

router.use(mw.cache('v_jobs'));



// -----------------
// List
// -----------------

router.get('/', controller(async ({ query, db }) => {

    const input = joi.check(query, {
        ...schemaSort,
        ...schemaFilter,
        ...schemas.pager,
    }, { required: false })

    const { page, limit, sort, ...filter } = input;
    const { origin } = filter;

    return db('v_jobs')
        .pager(page, limit)
        .query('v_jobs', 'filter', filter)
        .query('v_jobs', 'sort', sort, origin)
        .fields('v_jobs', 'item')

}))



// -----------------
// Count
// -----------------

router.get('/count', controller(async ({ query, db }) => {

    const input = joi.check(query, schemaFilter, { required: false });
    const common = omit(input, Object.values(FILTERS_JOBS));
    const custom = pick(input, Object.values(FILTERS_JOBS));

    const jobs = db('v_jobs')
        .query('v_jobs', 'filter', common)
        .select('id')
        .select(Object.keys(FILTERS_JOBS));

    const filters = Object.keys(FILTERS_JOBS).map(list => {
        const filter = omit(custom, FILTERS_JOBS[list]);
        return db('v_jobs')
            .query('v_jobs', 'filter', filter)
            .groupBy('value')
            .select([
                db.raw(`? as list`, list),
                db.raw(`COUNT(id) as total`),
                db.raw(`unnest(??) AS value`, list),
            ])
    })

    const total = db('v_jobs')
        .query('v_jobs', 'filter', custom)
        .select([
            db.raw(`'total' as list`),
            db.raw(`COUNT(id) as total`),
            db.raw(`0 AS value`),
        ])

    const raw = await db.with('v_jobs', jobs).unionAll([...filters, total]);
    const data = raw.reduce((data, { list, value, total }) => {
        data[list] ??= {};
        data[list][value] = total;
        return data;
    }, {})

    data.total = data.total[0];
    return data;

}))



// -----------------
// List
// -----------------

router.get('/map', controller(async ({ query, db }) => {

    const { bounds, zoom, ...filter } = joi.check(query, {
        ...schemaFilter,
        ...schemaMap
    })


    // data

    const GAP = 200;
    const MARKER = 50;
    const MAX_SCREEN_W = 3840;
    const MAX_SCREEN_H = 2160;

    const metPx = 40075016.686 / 256 / Math.pow(2, zoom);
    const lngPx = 360 / 256 / Math.pow(2, zoom);
    const latPx = lngPx / 2;

    const lngGap = GAP * lngPx;
    const latGap = GAP * latPx;
    const markerSize = MARKER * metPx;

    const bw = bounds[2] - bounds[0];
    const bh = bounds[3] - bounds[1];
    if (bw > MAX_SCREEN_W * lngGap || bh > MAX_SCREEN_H * latPx) throw new Exception('LIMIT_BOUNDS');


    // query

    const q1 = db('v_jobs')
        .query('v_jobs', 'filter', filter)
        .distinct('geometry')

    const q2 = db('q1')
        .groupByRaw('ST_SnapToGrid(geometry, ??, ??)', [lngGap, latGap])
        .selectRaw('ST_Centroid(ST_Collect(geometry)) AS geometry')
        .count('* AS count')

    const q3 = db('q2')
        .whereRaw(`ST_Intersects(geometry, ST_MakeEnvelope(??, ??, ??, ??, 4326))`, bounds)
        .selectRaw('ST_ClusterWithinWin(ST_Transform(geometry, 3857), ??) OVER () AS cluster', markerSize)
        .select('count', 'geometry')

    if (zoom < 18) return db
        .with('q1', q1)
        .with('q2', q2)
        .with('q3', q3)
        .from('q3')
        .groupBy('cluster')
        .selectRaw('SUM(count) AS count')
        .selectRaw('ST_X(ST_Centroid(ST_Collect(geometry))) AS lng')
        .selectRaw('ST_Y(ST_Centroid(ST_Collect(geometry))) AS lat')

    else return db
        .with('q1', q1)
        .from('q1')
        .whereRaw(`ST_Intersects(geometry, ST_MakeEnvelope(??, ??, ??, ??, 4326))`, bounds)
        .selectRaw('ST_X(geometry) AS lng')
        .selectRaw('ST_Y(geometry) AS lat')


}))



// -----------------
// Item
// -----------------

router.get('/:id', controller(async ({ params, db }) => {

    const { id } = joi.check(params, schemas.id);

    return db('v_jobs')
        .pk(id)
        .fields('v_jobs', 'item')

}))



// -----------------
// Details
// -----------------

router.get('/:id/details', controller(async ({ params, db }) => {

    const { id } = joi.check(params, schemas.id);

    return db('v_jobs')
        .fields('v_jobs', 'details')
        .pk(id)

}))



// -----------------
// Exports
// -----------------

export default router;