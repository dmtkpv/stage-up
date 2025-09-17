import { getDomain } from '@this/shared/utils.js'
import { empty } from '#root/global/utils.js'

export default async function ({ ssr, state, api, router, io }) {



    // -------------------
    // Data
    // -------------------

    const domain = getDomain(FRONTEND_URL);
    const refresh = api('auth-refresh');
    const logout = api('auth-logout');



    // -------------------
    // Cookies
    // -------------------

    const cookies = {

        add (cookie) {
            ssr ? state.cookies.add(cookie) : document.cookie = cookie;
        },

        get (key) {
            const value = ssr ? state.cookies.value : document.cookie;
            const data = Object.fromEntries(value.split('; ').map(a => a.split('=')))
            return data[key];
        },

        del (key) {
            cookies.set(key, '', '; Expires=Thu, 01 Jan 1970 00:00:01 GMT')
        },

        set (key, value, addition = '') {
            cookies.add(`${key}=${value}; Path=/; Domain=${domain}${addition}`);
        },

        get token () {
            return cookies.get('token')
        },

        get expires () {
            return cookies.get('expires')
        },

    }



    // -------------------
    // Methods
    // -------------------

    function create ({ token, expires }) {
        cookies.set('token', token);
        cookies.set('expires', new Date(expires).getTime() - 10000);
    }

    function destroy () {
        cookies.del('token');
        cookies.del('expires');
    }



    // -------------------
    // Load user
    // -------------------

    function load () {
        return Promise.all([
            api('account-me').fetch(),
            api('account-locale').fetch()
        ])
    }



    // -------------------
    // Refresh
    // -------------------

    api.onFetch(async ({ config }) => {
        if (!cookies.token) return;
        if (!config.unauthorized && Date.now() > cookies.expires) {
            if (refresh.pending) await refresh.promise;
            else await refresh.fetch();
        }
        if (!config.unauthorized) {
            config.headers['Authorization'] = `Bearer ${cookies.token}`;
        }
    })



    // -------------------
    // API Hooks
    // -------------------

    refresh.onSuccess(data => {
        create(data);
    })

    api.onFetch('auth-logout', () => {
        io.disconnect();
    })

    api.onComplete('auth-logout', () => {
        destroy();
        empty(state.user);
    })

    api.onSuccess('account-me', async data => {
        Object.assign(state.user, data);
    })

    api.onSuccess('auth-login', async data => {
        create(data);
        await load();
        io.connect(cookies.token);
    })

    api.onError('auth-login', async () => {
        if (cookies.token) await logout.quiet();
    })

    api.onError(async error => {
        if (error.code !== 'UNAUTHORIZED') return;
        if (logout.pending) await logout.promise;
        else await logout.quiet();
        const from = router.currentRoute.value.fullPath;
        const redirect = { name: 'auth-login', query: { from }}
        if (ssr) state.redirect = router.resolve(redirect).href;
        else await router.push(redirect);
    })



    // ----------------------
    // Restore inactive tab
    // ----------------------

    function restore () {
        const active = document.hasFocus() && !document.hidden;
        if (active && cookies.token) io.restore(cookies.token);
    }

    if (!ssr) {
        if (cookies.token) io.connect(cookies.token);
        document.addEventListener('visibilitychange', restore);
        window.addEventListener('focus', restore);
    }



    // -------------------
    // Restore user
    // -------------------

    state.user ??= {};

    if (ssr && cookies.token) {
        try { await load() }
        catch (e) { state.error = e }
    }

    if (!ssr) {
        io.on('plan', plan => state.user.plan = plan);
        io.on('restore', () => api('account-me').fetch());
    }





}