// HEADER
import express from 'express';

import { index, create, update, remove} from '../controllers/relfavorites';
import { authJwt } from '../middlewares';

const router = express.Router();

// ROUTES
router.get('/', [authJwt.verifyToken], index);
router.post('/', [authJwt.verifyToken], create);
router.put('/:id', [authJwt.verifyToken], update);
router.delete('/:id', [authJwt.verifyToken], remove);

// END
export default router;
