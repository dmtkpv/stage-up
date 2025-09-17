import '#root/styles/vars.scss'
import '#root/styles/reset.scss'
import '#root/styles/typography.scss'
import '#root/styles/modules.scss'
import { reactive } from 'vue'
import { createHead } from '@unhead/vue'
import createApp from 'vite-vue-ssr/createApp'
import createCrisp from '#root/services/crisp.js'
import createOverlay from '#root/services/overlay.js'
import createAPI from '#root/services/api.js'
import createContent from '#root/services/content.js'
import createRouter from '#root/services/router.js'
import createSession from '#root/services/session.js'
import createPlan from '#root/services/plan.js'
import createQs from '#root/services/qs.js'
import createIo from '#root/services/io.js'
import createErrors from '#root/services/errors.js'
import createToasts from '#root/services/toasts.js'
import App from '#root/index.vue'

export default createApp(App, async (app, data) => {



    // -------------------
    // Context
    // -------------------

    const ctx = {};
    ctx.ssr = import.meta.env.SSR;
    ctx.state = ctx.ssr ? data : reactive(data); // reactivity not working in SSR and state.server should not be reactive
    ctx.errors = createErrors(ctx);
    ctx.toasts = createToasts(ctx);
    ctx.head = createHead();
    ctx.overlay = createOverlay(ctx);
    ctx.api = createAPI(ctx);
    ctx.content = await createContent(ctx);
    ctx.qs = createQs(ctx);
    ctx.plan = createPlan(ctx);
    ctx.router = createRouter(ctx);
    ctx.crisp = createCrisp(ctx);
    ctx.io = createIo(ctx);

    await createSession(ctx);



    // -------------------
    // Setup
    // -------------------

    app.use(ctx.head);
    app.use(ctx.router);
    app.provide('api', ctx.api);
    app.provide('ssr', ctx.ssr);
    app.provide('content', ctx.content);
    app.provide('state', ctx.state);
    app.provide('overlay', ctx.overlay);
    app.provide('crisp', ctx.crisp);
    app.provide('plan', ctx.plan);
    app.provide('io', ctx.io);
    app.provide('errors', ctx.errors);
    app.provide('toasts', ctx.toasts);
    app.mount('body');



})