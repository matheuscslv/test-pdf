// HEADER
import express from 'express';

import { auth, logoff } from '../controllers/login';
import { authJwt } from '../middlewares';

const router = express.Router();

// ROUTES
router.post('/', auth);
router.post('/exit', [authJwt.verifyToken], logoff);

// END
export default router;
