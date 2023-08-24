// HEADER
import express from 'express';

import { images } from '../controllers/images';
import { authJwt } from '../middlewares';

const router = express.Router();

// ROUTES
router.post('/', [authJwt.verifyToken], images);

// END
export default router;
