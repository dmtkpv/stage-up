import { AUTH } from '@this/shared/constants.js'
import { createServer } from 'http'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import Assets from './routes/route-assets.js'
import Content from './routes/route-content.js'
import Auth from './routes/route-auth.js'
import Account from './routes/route-account.js'
import Places from './routes/route-places.js'
import Jobs from './routes/route-jobs.js'
import Views from './routes/route-views.js'
import Stripe from './routes/route-stripe.js'
import Candidates from './routes/route-candidates.js'
import Companies from './routes/route-companies.js'
import { jwt, Exception, io, storage } from './index.js'
import './actions.js'



// -----------------
// Data
// -----------------

const { BACKEND_PORT, FRONTEND_URL, FRONTEND_ALIAS, VERSION } = process.env;
const aliases = FRONTEND_ALIAS ? FRONTEND_ALIAS.split(',') : [];
const app = express();
const server = createServer(app);



// -----------------
// Web socket
// -----------------

io.attach(server);



// -----------------
// Logs
// -----------------

morgan.token('time', () => {
    return new Date().toLocaleTimeString('en', { hour12: false })
});

app.use(morgan('[:time] :method :url :status', {
    skip: req => req.method === 'OPTIONS'
}));



// -----------------
// Middlewares
// -----------------

app.use(cookieParser());

app.use((req, res, next) => {
    if (req.originalUrl === '/stripe/webhook') next();
    else express.json()(req, res, next);
});

app.use(cors({
    origin: [FRONTEND_URL, ...aliases],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Version']
}))



// -----------------
// Set locale
// -----------------

app.use((req, res, next) => {
    res.locals.locale = req.acceptsLanguages('nl', 'en') || 'nl';
    next();
});



// -----------------
// Version mismatch
// -----------------

app.use((req, res, next) => {
    const version = req.get('Version');
    if (version && version !== VERSION) throw new Exception('DEPRECATED', { version, required: VERSION });
    next();
})



// -----------------
// Get user & role
// -----------------

app.use((req, res, next) => {
    const auth = req.get('Authorization');
    if (!auth?.startsWith('Bearer ')) return next();
    const token = auth.split(' ').pop();
    try {
        const data = jwt.verify(token);
        Object.assign(res.locals, data);
    }
    catch (e) {
        throw new Exception('UNAUTHORIZED')
    }
    next();
});




// -----------------
// Set routes
// -----------------

app.use('/assets', Assets)
app.use('/content', Content)
app.use('/auth', Auth)
app.use('/places', Places)
app.use('/account', Account)
app.use('/jobs', Jobs)
app.use('/views', Views)
app.use('/stripe', Stripe)
app.use('/candidates', Candidates)
app.use('/companies', Companies)



// -----------------
// 404
// -----------------

app.use(() => {
    throw new Exception('NOT_FOUND')
})



// -----------------
// Error handler
// -----------------

export function getErrorCode ({ code, name, type }) {
    if (name === 'TokenExpiredError') return 'EXPIRED_TOKEN';
    if (name === 'JsonWebTokenError') return 'INVALID_TOKEN';
    if (code === '23505') return 'DUPLICATE_ENTRY';
    if (code === '23503') return 'NO_REFERENCE';
    return code;
}

app.use(async (err, req, res, next) => {
    console.log(err)
    const { locale } = res.locals;
    const data = err.data;
    const code = getErrorCode(err);
    const errors = storage.get('errors');
    const error = errors.find(error => error.code === code) || errors.find(error => error.code === 'INTERNAL_SERVER_ERROR');
    const message = error.message[locale];
    if (code === 'UNAUTHORIZED') res.clearCookie(AUTH.cookie);
    res.status(error.status).json({ error: { ...error, message, data }})
})



// -----------------
// Run
// -----------------

server.listen(BACKEND_PORT, () => {
    console.log(`http://localhost:${BACKEND_PORT}`)
})

