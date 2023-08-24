// HEADER
import express from 'express';

import { auth } from '../controllers/callback';

const router = express.Router();

// ROUTES
router.get('/', auth);

// END
export default router;
