import express from 'express'
import Stripe from 'stripe'
import PQueue from 'p-queue'
import { Exception, controller, joi, mw, io, knex } from '#root/index.js'



// -----------------
// Data
// -----------------

const { STRIPE_SECRET, STRIPE_WEBHOOK_SECRET, STRIPE_TAX_RATE, FRONTEND_URL } = process.env;
const stripe = Stripe(STRIPE_SECRET);



// -----------------
// Data
// -----------------

const router = express.Router();
const queues = {};



// -----------------
// Upsert
// -----------------

async function upsert (subscriptions) {

    const customer = subscriptions[0].customer;
    const current = await knex('companies')
        .leftJoin('v_plans', 'v_plans.company', 'companies.id')
        .where('stripe_customer', customer)
        .select('companies.id', 'v_plans.value AS plan')
        .first();

    if (!current) throw new Error(`Company not found for customer: ${customer}`);
    const company = current.id;

    const data = subscriptions.map(sub => ({
        id: sub.id,
        company: company,
        price: sub.items.data[0].plan.id,
        status: sub.status,
        canceled: sub.cancel_at_period_end,
        expires_at: new Date(sub.current_period_end * 1000),
        updated_at: new Date()
    }))

    await knex('subscriptions')
        .insert(data)
        .onConflict('id')
        .merge();

    const [plan = null] =  await knex('v_plans').where({ company }).pluck('value');
    if (current.plan === plan) return plan;

    const update = knex('jobs').whereIn('location', function () {
        this.from('locations').where({ company }).select('id')
    })

    if (plan === 3) {
        await update.update({ premium: true })
    }

    else {
        let skip;
        if (plan === 1) skip = 1;
        if (plan === 2) skip = 5;
        if (skip) {
            const jobs = await knex('jobs')
                .relation('jobs', 'locations')
                .where('locations.company', company)
                .where('jobs.premium', true)
                .where('jobs.archived', false)
                .orderBy('jobs.created_at', 'asc')
                .limit(skip)
                .pluck('jobs.id');
            if (jobs.length) {
                update.whereNotIn('id', jobs);
            }
        }
        await update.update({ premium: false, urgent: false })
    }

    io.to(`company-${company}`).emit('plan', plan);

}



// -----------------
// Create
// -----------------

async function refresh (subscriptions) {
    const customer = subscriptions[0].customer;
    queues[customer] ??= new PQueue({ concurrency: 1 });
    return queues[customer].add(() => upsert(subscriptions));
}



// -----------------
// Create
// -----------------

router.post('/', mw.role('company'), controller(async ({ body, company, locale, routes, db }) => {


    // common

    const input = joi.check(body, {
        price_id: joi.string().required(),
        path: joi.string().pattern(/^\/[^\s]*$/).required(),
        job: joi.number().natural()
    })

    const price = await db('plans_prices').pk(input.price_id).where('active', true);
    if (!price) throw new Exception('INVALID_SUBSCRIPTION');

    const data = await db('companies').pk(company).select('name', 'email', 'stripe_customer');
    if (!data) throw new Exception('INVALID_SUBSCRIPTION');

    if (!data.stripe_customer) {
        const customer = await stripe.customers.create({ name: data.name, email: data.email });
        await db('companies').where({ id: company }).$update({ stripe_customer: customer.id });
        data.stripe_customer = customer.id;
    }

    const query = input.job ? { job: input.job } : undefined;
    const success_url = routes.resolve('stripe-success', { locale, query });
    const cancel_url = FRONTEND_URL + (locale === 'en' ? '/en' : '') + input.path;

    const subscriptions = await stripe.subscriptions.list({
        customer: data.stripe_customer
    });

    if (subscriptions.data.length > 1) {
        throw new Exception('INVALID_SUBSCRIPTION');
    }


    // create

    else if (subscriptions.data.length === 0) {

        const cancelled = await stripe.subscriptions.list({
            customer: data.stripe_customer,
            status: 'canceled',
            limit: 1
        });

        const subscription_data = {
            trial_period_days: cancelled.data.length ? undefined : 30,
            default_tax_rates: [STRIPE_TAX_RATE]
        }

        const { url } = await stripe.checkout.sessions.create({
            locale,
            success_url,
            cancel_url,
            subscription_data,
            mode: 'subscription',
            customer: data.stripe_customer,
            line_items: [{ price: input.price_id, quantity: 1 }]
        });

        return { url };
    }


    // update

    else {

        const current = subscriptions.data[0];
        const items = current.items.data;

        if (!items.length || items.length > 1) throw new Exception('INVALID_SUBSCRIPTION');
        if (items[0].price.id === input.price_id) throw new Exception('INVALID_SUBSCRIPTION');

        await stripe.subscriptions.update(current.id, {
            proration_behavior: 'always_invoice',
            items: [{
                id: items[0].id,
                price: input.price_id,
            }]
        });
        
        return { url: success_url }

    }


}))



// -----------------
// Manage
// -----------------

router.post('/manage', mw.role('company'), controller(async ({ company, locale, routes, db }) => {

    const data = await db('companies').pk(company).select('stripe_customer');
    if (!data?.stripe_customer) throw new Exception('INVALID_SUBSCRIPTION');

    const { url } = await stripe.billingPortal.sessions.create({
        locale,
        return_url: routes.resolve('stripe-success', { locale }),
        customer: data.stripe_customer
    });

    return { url }

}))



// -----------------
// Success
// -----------------

router.post('/success', mw.role('company'), controller(async ({ company, db }) => {

    const data = await db('companies').pk(company).select('stripe_customer');
    if (!data?.stripe_customer) throw new Exception('NOT_FOUND');

    const subscriptions = await stripe.subscriptions.list({
        customer: data.stripe_customer,
        status: 'all',
        limit: 100
    });

    if (subscriptions.data.length) {
        await refresh(subscriptions.data);
    }

}))



// -----------------
// Webhook
// -----------------

router.post('/webhook', express.raw({ type: 'application/json' }), controller(async ({ headers, body, db }) => {

    const events = [
        'customer.subscription.created',
        'customer.subscription.deleted',
        'customer.subscription.paused',
        'customer.subscription.resumed',
        'customer.subscription.updated'
    ]

    try {
        const sig = headers['stripe-signature'];
        const event = stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET);
        if (events.includes(event.type)) {
            await refresh([event.data.object]);
        }
    }

    catch (error) {
        throw new Exception('INTERNAL_SERVER_ERROR', {
            message: error.message || 'An unexpected error occurred.',
            stack: error.stack
        })
    }

}))



// -----------------
// Exports
// -----------------

export default router;