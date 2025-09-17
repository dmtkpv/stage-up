import { knex } from '#root/index.js'
const t = Date.now();

try {
    await knex.raw(`
        INSERT INTO jobs_views (ip, job)
        SELECT 'fake-${t}' AS ip, id as job
        FROM v_jobs
        WHERE premium = true AND RANDOM() > 0.98
    `)
}
catch (e) {
    console.error(e);
}
finally {
    await knex.$destroy();
}



