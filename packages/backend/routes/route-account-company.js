import express from 'express'
import Stripe from 'stripe'
import { FILES, FOLDERS } from '@this/shared/constants.js'
import { controller, slugify, joi, mw } from '#root/index.js'



// -----------------
// Data
// -----------------

const { STRIPE_SECRET } = process.env;
const stripe = Stripe(STRIPE_SECRET);
const router = express.Router();

const schema = {
    name: joi.string(),
    email: joi.string().email().lowercase(),
    phone: joi.string().allow(null),
    website: joi.string().website().allow(null),
    facebook: joi.string().website().facebook().allow(null),
    about: joi.string().html().min(30).allow(null),
    recognized: joi.boolean().allow(null),
    branches: joi.array().items(joi.number().natural())
}



// -----------------
// Middlewares
// -----------------

router.use(mw.role('company'));



// -----------------
// Item
// -----------------

router.get('/', controller(async ({ company, db }) => {

    return db('companies')
        .leftJoin('companies_branches', 'companies_branches.company', 'companies.id')
        .pk(company)
        .groupBy('companies.id')
        .select([
            'companies.id',
            'companies.name',
            'companies.email',
            'companies.phone',
            'companies.website',
            'companies.facebook',
            'companies.about',
            'companies.image',
            'companies.recognized',
            db.raw(`ARRAY_REMOVE(ARRAY_AGG(DISTINCT companies_branches.branch), NULL) AS branches`)
        ])
}))



// -----------------
// Update
// -----------------

router.patch('/', controller(async ({ body, company, db }) => {

    const input = joi.check(body, schema)
    if (input.name) input.slug = slugify(input.name);

    const data = db('companies').pk(company).$update(input);

    if (input.email) {
        const { stripe_customer } = await db('companies').pk(company).select('stripe_customer');
        if (stripe_customer) await stripe.customers.update(stripe_customer, { email: input.email });
    }

    return data;

}))



// -----------------
// Image
// -----------------

router.post('/image', controller(async ({ company, files, db }) => {

    const { size, extensions } = FILES.avatar;
    const { image } = await db('companies').pk(company).select('image');

    const { id } = await files.upload({
        size, extensions,
        folder: FOLDERS.companies
    });

    await db('companies').pk(company).$update({ image: id });

    if (image) {
        await files.remove(image);
    }

    return { id }

}))



// -----------------
// Exports
// -----------------

export default router;