import { knex, jwt } from '#root/index.js'

const email = process.argv.pop();
const data = await knex('users').fields('users', 'auth').where('users.email', email).first();


data.type = data.company ? 'company' : 'candidate';
data.user = data.id;
delete data.id;

console.log(jwt.sign(data, '1y'));
await knex.$destroy();