// HEADER
import express from 'express';

import { details } from '../controllers/details';
import { authJwt } from '../middlewares';

const router = express.Router();

// ROUTES
router.post('/', [authJwt.verifyToken], details);

// END
export default router;
