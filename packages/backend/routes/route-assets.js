import express from 'express'
import { controller, joi, schemas } from '#root/index.js'



// -----------------
// Data
// -----------------

const router = express.Router();



// -----------------
// Jobs
// -----------------

router.get('/:id', controller(async ({ files, params, query }) => {
    const { id } = joi.check(params, schemas.uuid);
    return files.read(id, query);
}))



// -----------------
// Exports
// -----------------

export default router;