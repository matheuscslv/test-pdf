import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';

import config from '../config/auth';
import User from '../database/entities/User';

async function verifyToken(req: Request, res: Response, next: NextFunction) {
  let user = null;

  if (process.env.NODE_ENV !== 'development') {
    let token = req.headers.authorization;
    token = token?.replace('Bearer ', '');

    if (!token) {
      return res.status(403).send({
        message: 'Nenhum token foi fornecido!',
      });
    }

    jwt.verify(token, config.secret || '', (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: 'Não autorizado!',
        });
      }

      // @ts-ignore
      req.userId = decoded.id;
    });

    const repository = getRepository(User);
    user = await repository.findOne({ where: { token } });

    if (user) {
      next();
    } else {
      return res.status(401).send({
        message: 'Não autorizado!',
      });
    }
  } else {
    next();
  }
}

export default {
  verifyToken,
};
