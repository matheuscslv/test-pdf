// HEADER
import express from 'express';

import { index, show, create, update, remove } from '../controllers/profiles';
import { authJwt } from '../middlewares';

const router = express.Router();

// ROUTES
router.get('/', [authJwt.verifyToken], index);
router.get('/:id', [authJwt.verifyToken], show);
router.post('/', [authJwt.verifyToken], create);
router.put('/:id', [authJwt.verifyToken], update);
router.delete('/:id', [authJwt.verifyToken], remove);

// END
export default router;
