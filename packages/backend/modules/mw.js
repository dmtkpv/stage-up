import { Exception } from '@this/shared/utils.js'
import { ROLES } from '@this/shared/constants.js'
import { caches } from './cache.js'

export default {

    authorized () {
        return function (req, res, next) {
            if (res.locals.user) return next();
            throw new Exception('FORBIDDEN');
        }
    },

    role (...names) {
        return function (req, res, next) {
            const role = names.find(name => ROLES[name] === res.locals.role);
            if (role) return next();
            else throw new Exception('FORBIDDEN');
        }
    },

    use (services) {
        return function (req, res, next) {
            req.services ??= {};
            Object.assign(req.services, services);
            next();
        }
    },

    cache (data) {
        return function (req, res, next) {
            const key = typeof data === 'function' ? data(req) : data;
            req.cache = caches[key];
            next();
        }
    }

}