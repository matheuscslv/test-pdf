// HEADER
import express from 'express';

import {
  index,
  show,
  userlogged,
  create,
  update,
  remove,
} from '../controllers/users';
import { authJwt } from '../middlewares';

const router = express.Router();

// ROUTES
router.get('/', [authJwt.verifyToken], index);
router.get('/userlogged', [authJwt.verifyToken], userlogged);
router.get('/:cpf', [authJwt.verifyToken], show);
router.post('/', [authJwt.verifyToken], create);
router.put('/:id', [authJwt.verifyToken], update);
router.delete('/:id', [authJwt.verifyToken], remove);

// END
export default router;
