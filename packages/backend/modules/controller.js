import { Exception } from '@this/shared/utils.js'
import use from '#root/services/use.js'

export default function controller (fn) {
    return async function (req, res, next) {
        try {

            const { params, query, body, headers, services, cache, originalUrl } = req;
            const ctx = { res, req, params, query, body, headers, services, ...res.locals };

            const key = `${ctx.locale}:${originalUrl}`;
            const data = cache?.get(key) ?? await use(ctx, fn);
            if (cache) cache.set(key, data);

            if (req.method === 'DELETE') {
                if (!data) throw new Exception('NOT_FOUND');
                else return res.send(null);
            }

            if (req.method === 'PATCH') {
                if (!data) throw new Exception('NOT_FOUND');
                else return res.send(null);
            }

            if (req.method === 'GET') {
                if (data == null) throw new Exception('NOT_FOUND')
            }

            if (req.method === 'POST') {
                if (data == null) return res.send(null);
            }

            if (!res.headersSent) {
                res.json({ data });
            }

        }
        catch (err) {
            next(err);
        }
    }
}