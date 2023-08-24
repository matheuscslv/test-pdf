// HEADER
import express from 'express';

import { index, show, create, update } from '../controllers/solicitations';
import { authJwt } from '../middlewares';

const router = express.Router();

// ROUTES
router.get('/', [authJwt.verifyToken], index);
router.get('/:id', [authJwt.verifyToken], show);
router.post('/', [authJwt.verifyToken], create);
router.put('/:id', [authJwt.verifyToken], update);

// END
export default router;
