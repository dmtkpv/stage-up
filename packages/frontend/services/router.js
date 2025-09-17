import merge from 'lodash.merge'
import createRouter from 'vite-vue-ssr/createRouter'
import { stringifyQuery } from 'vue-router'
import config from '#root/config/routes.js'
import { getProp } from '#root/global/utils.js'

export default function ({ ssr, api, state, qs, content, plan, overlay, errors }) {



    // -------------------
    // Data
    // -------------------

    let ssrError = state.error;
    const cache = {};
    const ctx = { api, state, qs, plan, content, ssr, cache };
    const routes = [];
    const history = [];



    // -------------------
    // Add routes
    // -------------------

    function createRoute (config) {
        const { path, title } = state.content.routes[config.name];
        const route = merge(config, { path, meta: { title }});
        if (route.children) route.children = route.children.map(createRoute)
        return route;
    }

    config.forEach(config => {
        routes.push(createRoute(config));
    })





    // -------------------
    // Router
    // -------------------

    const router = createRouter({
        routes,
        base: state.base,
        stringifyQuery (query) {
            Object.keys(query).forEach(key => {
                const value = query[key];
                if (value?.lat && value?.lng) query[key] = `${value.lat},${value.lng}`
            })
            return stringifyQuery(query);
        },
        scrollBehavior: (to, from) => {
            if (to.hash) {
                const top = getProp('--header') + 24;
                return { top, el: to.hash }
            }
            if (to.name !== from.name ||
                to.params.id !== from.params.id ||
                to.query.page !== from.query.page ||
                to.hash !== from.hash
            ) return { top: 0 }
        }
    })



    // -------------------
    // Helpers
    // -------------------

    function redirect (route) {
        if (!ssr) return route;
        state.redirect = router.resolve(route).href;
        return false;
    }

    function getProperty (components, prop) {
        return components.map(component => component[prop]).filter(value => !!value);
    }

    async function preload (fn, to, from) {
        const data = await fn(ctx, to, from);
        if (!data) return;
        const values = await Promise.all(Object.values(data));
        return Object.keys(data).reduce((result, key, index) => {
            result[key] = values[index];
            return result
        }, {})
    }

    async function getPreload (to, from) {
        const components = to.matched.map(route => route.components.default).flat();
        const preloads = getProperty(components, 'preload').map(fn => preload(fn, to, from));
        const texts = getProperty(components, 'texts').flat();
        const lists = getProperty(components, 'lists').flat();
        const features = getProperty(components, 'features').flat();
        const data = await Promise.all([...preloads, content.loadTexts(texts), content.loadLists(lists), content.loadFeatures(features)])
        return data.reduce((payload, value) => Object.assign(payload, value), {});
    }

    function getRedirect (to) {
        const components = to.matched.map(route => route.components.default).flat();
        return getProperty(components, 'redirect').map(fn => fn(to, ctx)).find(val => val);
    }

    function getBack ({ meta: { back }, name, params, query, hash }) {
        const length = history.push({ name, params, query, hash });
        if (length > 100) history.shift();
        if (!back) return;
        if (typeof back === 'function') return back(history.at(-1), history.at(-2));
        const latest = history.findLast(route => back.includes(route.name));
        if (latest) return latest;
        else return { name: back[0] };
    }

    

    // -------------------
    // Before each
    // -------------------

    router.beforeEach(async (to, from) => {

        api.cancel();

        if (ssrError) { // do nothing if there was an error during SSR
            to.meta.error = ssrError;
            ssrError = false;
            return;
        }

        if (!to.matched.length) {
            to.meta.error = errors.get('NOT_FOUND');
            return;
        }

        if (to.meta.roles && !state.user?.id) {
            return redirect({ name: 'auth-login', query: { from: to.fullPath } });
        }

        if (to.meta.roles && !to.meta.roles.includes(state.user?.role)) {
            to.meta.error = errors.get('FORBIDDEN');
            return;
        }

        if (to.meta.plan && (to.meta.plan !== state.user?.plan)) {
            to.meta.error = errors.get('FORBIDDEN');
            return;
        }

        state.loadingRoute = true;

    })



    // -------------------
    // Before resolve
    // -------------------

    router.beforeResolve(async (to, from) => {

        state.loadingRoute = false;

        if (state.preload) {
            to.meta.preload = state.preload;
            delete state.preload;
            return;
        }

        try {
            to.meta.preload = await getPreload(to, from);
        }

        catch (error) {
            if (error.code === 'ERR_CANCELED') return false;
            if (error.code === 'UNAUTHORIZED') return false; // handles in session
            console.error(error)
            to.meta.error = error;
            return;
        }

        const redirection = getRedirect(to);
        if (redirection) return redirect(redirection);

        if (ssr) {
            state.preload = to.meta.preload;
        }

        state.back = getBack(to);

    })



    // -------------------
    // After each
    // -------------------

    router.afterEach(to => {
        if (to.meta.error) state.error = to.meta.error;
        else delete state.error;
    })



    // -------------------
    // Exports
    // -------------------

    return router;



}