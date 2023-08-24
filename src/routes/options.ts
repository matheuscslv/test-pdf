// HEADER
import express from 'express';

import { options } from '../controllers/options';
import { authJwt } from '../middlewares';

const router = express.Router();

// ROUTES
router.get('/', [authJwt.verifyToken], options);

// END
export default router;
