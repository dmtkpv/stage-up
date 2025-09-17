import endpoints from '#root/config/api.js'
import createAPI from './api/index.js'

export default function ({ ssr, state, errors }) {



    // -------------------
    // Data
    // -------------------

    const api = createAPI({
        baseURL: BACKEND_URL,
        endpoints
    })



    // -------------------
    // On fetch
    // -------------------

    api.onFetch(({ config }) => {
        config.headers ??= {};
        config.headers['Version'] = APP_VERSION;
        config.headers['Accept-Language'] = state.locale;
        if (ssr && config.withCredentials) {
            config.headers.Cookie = state.cookies.value;
        }
    })



    // -------------------
    // On success
    // -------------------

    api.onSuccess(response => {
        if (ssr && response.headers['set-cookie']) {
            response.headers['set-cookie'].forEach(state.cookies.add);
        }
        return response.data.data ?? null;
    })



    // -------------------
    // On error
    // -------------------

    api.onError((e, endpoint) => {

        if (endpoint.key === 'auth-refresh') {
            throw e; // parent request handles this
        }

        if (!ssr && e.response?.status === 426) {
            window.location.reload();
            throw errors.get('DEPRECATED');
        }

        if (e.response) {
            const error = e.response.data.error;
            const config = e.config;
            throw error;
        }

        else {
            throw errors.get('INTERNAL_SERVER_ERROR');
        }

    })



    // -------------------
    // Exports
    // -------------------

    return api;



}