// HEADER
import express from 'express';

import { individual, general } from '../controllers/report';
import { authJwt } from '../middlewares';

const router = express.Router();

// ROUTES
router.post('/individual', [authJwt.verifyToken], individual);
router.post('/general', [authJwt.verifyToken], general);

// END
export default router;
