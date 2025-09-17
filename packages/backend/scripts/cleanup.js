import { knex } from '#root/index.js'



// -----------------
// Translations
// -----------------

async function translations () {

    console.log('Deleting unused translations')

    let count = 0;
    const translations = await knex('translations').select('id');

    for (const { id } of translations) {
        await knex('translations')
            .where({ id })
            .del()
            .then(() => count++)
            .catch(e => {})
    }

    console.log(`Deleted ${count} translations`);

}



// -----------------
// Exec
// -----------------

await translations();
await knex.$destroy();