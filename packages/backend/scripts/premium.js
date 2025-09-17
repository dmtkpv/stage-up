import { knex } from '#root/index.js'

try {
    await knex.raw(`

        WITH companies AS (
            SELECT DISTINCT(subscriptions.company) AS id
            FROM subscriptions
            LEFT JOIN v_plans ON v_plans.company = subscriptions.company
            WHERE
                now() - subscriptions.updated_at > INTERVAL '1 hour' AND
                v_plans.company IS NULL
        )

        UPDATE jobs
        SET premium = false, urgent = false
        FROM locations
        INNER JOIN companies ON companies.id = locations.company
        WHERE
            jobs.location = locations.id AND
            jobs.premium = true
    `)

}
catch (e) {
    console.error(e);
}
finally {
    await knex.$destroy();
}