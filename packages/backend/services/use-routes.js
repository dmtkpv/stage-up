import { Exception, joi, storage } from '#root/index.js'

export default function () {



    // -------------------
    // Data
    // -------------------

    const { FRONTEND_URL } = process.env;



    // -------------------
    // Get path
    // -------------------

    function getPath (name, locale) {
        const path = [];
        const routes = storage.get('routes');
        while (name) {
            const route = routes.find(route => route.name === name);
            if (!route) throw new Exception('NOT_FOUND');
            path.unshift(route.path[locale]);
            name = route.parent;
        }
        return path.join('/');
    }



    // -------------------
    // Resolve
    // -------------------

    function resolve (name, options) {

        const { query, params, locale } = joi.check(options, {
            locale: joi.string().valid('en', 'nl').required(),
            query: joi.object(),
            params: joi.object()
        });

        const path = getPath(name, locale);

        let url = path.replace(/:(\w+)/g, (match, param) => {
            if (!params?.[param]) throw new Exception('NO_ROUTE_PARAM');
            return params[param];
        });

        if (query) {
            url += '?'
            url += new URLSearchParams(query).toString()
        }

        if (locale === 'en') {
            url = '/en' + url;
        }

        return FRONTEND_URL + url;

    }



    // -------------------
    // Exports
    // -------------------

    return {
        resolve
    }



}