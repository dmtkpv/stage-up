import { ADMIN } from '@this/shared/constants.js'
import PG from 'pg'
import Knex from 'knex'

import config from './config/knexfile.js'
import models from './config/models.js'
import views from './config/views.js'
import triggers from './config/triggers.js'
import extensions from './config/extensions.js'

import getSchema from './utils/schema.js'
import seedViews from './utils/views.js'
import seedTriggers from './utils/triggers.js'



// -----------------
// Fix count string
// -----------------

PG.types.setTypeParser(20, 'text', parseInt)



// -----------------
// Knex
// -----------------

const knex = Knex(config);

Object.assign(knex.client, {
    userParams: {
        user: ADMIN,
        locale: 'nl'
    }
})

Object.assign(extensions, {
    config: {
        models,
        schema: await getSchema(knex)
    }
})

Object.keys(extensions).forEach(key => {
    Knex.QueryBuilder.extend(key, extensions[key]);
})



// -----------------
// Seed
// -----------------

await seedViews(knex, views);
await seedTriggers(knex, triggers);



// -----------------
// Notification
// -----------------

const listeners = {};
const pg = new PG.Client(config.connection);
await pg.connect();
await pg.query('LISTEN main');

pg.on('notification', async ({ payload }) => {
    const { action, ...params } = JSON.parse(payload);
    const cbs = listeners[action]?.map(cb => cb(params)) ?? [];
    try { await Promise.all(cbs) }
    catch (e) { console.log(e) }
});

knex.action = (action, cb) => {
    listeners[action] ??= [];
    listeners[action].push(cb);
}



// -----------------
// Destroy
// -----------------

knex.$destroy = async function (cb) {
    await pg.end();
    await knex.destroy(cb);
};



// -----------------
// Exports
// -----------------

export default knex;