// HEADER
import express from 'express';

import { search } from '../controllers/search';
import { authJwt } from '../middlewares';

const router = express.Router();

// ROUTES
router.post('/', [authJwt.verifyToken], search);

// END
export default router;
