import { ROLES } from '@this/shared/constants.js'
import { knex, createQueue, use, caches } from '#root/index.js'



// ----------------------
// Refresh v_jobs
// ----------------------

knex.action('v_jobs', createQueue(async () => {
    const start = Date.now();
    console.log(`REFRESH v_jobs START`)
    await knex.raw(`REFRESH MATERIALIZED VIEW CONCURRENTLY v_jobs`);
    console.log(`REFRESH v_jobs END`, Date.now() - start)
    caches['v_jobs'].flushAll();
}, 1000))



// ----------------------
// Reject application
// ----------------------

knex.action('application_archived', async ({ id }) => {

    const data = await knex('applications')
        .innerJoin('rooms', 'applications.room', 'rooms.id')
        .innerJoin('users', 'users.company', 'rooms.company')
        .pk(id)
        .where('applications.status', 'PENDING')
        .where('users.role', ROLES.company)
        .selectJSON('room', [
            'rooms.candidate',
            'rooms.company',
            'rooms.job',
        ])
        .selectJSON('ctx', [
            'users.id AS user',
            'users.company',
            'users.role',
            `'company' AS type`
        ])

    if (!data) return;
    const { room, ctx } = data;
    const message = { room, template: 'APPLICATION_REJECTED' }
    await use(ctx, ({ rooms }) => rooms.message(message));

})