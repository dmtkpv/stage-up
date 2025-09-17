import { CACHED } from '@this/shared/constants.js'
import { createQueue } from '@this/shared/utils.js'
import NodeCache from 'node-cache'
import knex from '#root/database/knex.js'



// -----------------
// Data
// -----------------

const caches = {};
const storage = new NodeCache();

[...CACHED, 'v_jobs'].forEach(table => {
    caches[table] = new NodeCache();
})



// -----------------
// Storage getters
// -----------------

const getters = {

    routes: () => knex('routes')
        .innerJoin('translations', 'translations.id', 'routes.path')
        .select(['routes.name', 'routes.parent'])
        .selectJSON('path', ['translations.en', 'translations.nl']),

    errors: () => knex('errors')
        .innerJoin('translations', 'translations.id', 'errors.message')
        .select(['errors.code', 'errors.status'])
        .selectJSON('message', ['translations.en', 'translations.nl'])

}



// -----------------
// Load data
// -----------------

for (const table in getters) {
    storage.set(table, await getters[table]())
}



// -----------------
// Update cache
// -----------------

knex.action('uncache', createQueue(async ({ table }) => {
    caches[table].flushAll();
    if (getters[table]) storage.set(table, await getters[table]())
}))



// -----------------
// Exports
// -----------------

export {
    caches,
    storage
}