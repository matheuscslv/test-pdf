// HEADER
import express from 'express';

import { index, create, update, remove, search, basicConfigGet, basicConfigSet } from '../controllers/relatories';
import { authJwt } from '../middlewares';

const router = express.Router();

// ROUTES
router.get('/', [authJwt.verifyToken], index);
router.get('/search', [authJwt.verifyToken], search);
router.post('/', [authJwt.verifyToken], create);
router.put('/:id', [authJwt.verifyToken], update);
router.delete('/:id', [authJwt.verifyToken], remove);

router.get('/config', [authJwt.verifyToken], basicConfigGet);
router.post('/config', [authJwt.verifyToken], basicConfigSet);


// END
export default router;
