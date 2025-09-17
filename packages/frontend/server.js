import express from 'express';
import cookieParser from 'cookie-parser'
import nocache from 'nocache'
import compression from 'compression'
import handler from 'express-async-handler'
import createSSR from 'vite-vue-ssr/createSSR'
import Axios from 'axios'



// -------------------
// Data
// -------------------

const { FRONTEND_PORT, BACKEND_URL, NODE_ENV } = process.env;

const axios = Axios.create({
    baseURL: BACKEND_URL
})

const errors = {
    en: await loadErrors('en'),
    nl: await loadErrors('nl'),
}



// -------------------
// Load errors
// -------------------

async function loadErrors (locale) {

    try {
        const response = await axios.get('/content/errors', {
            headers: { ['Accept-Language']: locale }
        })
        return response.data.data;
    }

    catch (e) {
        console.log('Backend not responding...')
        setTimeout(() => loadErrors(locale), 2000)
    }

}



// -------------------
// Cookies
// -------------------

function createCookies (req, res) {

    const cookies = {
        ...req.cookies
    }

    return {

        get value () {
            return Object.entries(cookies).map(([key, value]) => `${key}=${value}`).join('; ');
        },

        add (cookie) {
            const [name, value] = cookie.split(';')[0].split('=');
            cookies[name] = value;
            res.append('Set-Cookie', cookie);
        }

    }

}



// -------------------
// Server
// -------------------

(async () => {

    const app = express();

    const ssr = await createSSR({
        mode: NODE_ENV,
        build: false
    });

    app.use(cookieParser());
    app.use(compression());
    app.use(ssr.middlewares);
    app.use('/tinymce', express.static('node_modules/tinymce'))

    app.use((req, res, next) => {
        if (req.path === '/en') res.redirect(301, '/en/')
        else next();
    })

    app.get('/en/*', (req, res, next) => {
        res.locals.locale = 'en';
        res.locals.base = '/en';
        res.locals.path = req.url.replace(/^\/en/, '')
        next();
    })

    app.get('/*', nocache(), handler(async (req, res) => {
        const locale = res.locals.locale || 'nl';
        const path = res.locals.path || req.url;
        const base = res.locals.base;
        const cookies = createCookies(req, res);
        const state = { locale, base, cookies, errors: errors[locale] };
        const html = await ssr.render(path, state);
        if (state.redirect) return res.redirect(state.redirect);
        const status = state.error ? state.error.status || 500 : 200;
        res.status(status).send(html);
    }))

    app.listen(FRONTEND_PORT, () => {
        console.log(`http://localhost:${FRONTEND_PORT}`)
    })

})();