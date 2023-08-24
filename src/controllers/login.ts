import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { LoginService } from './services/LoginService';

export async function auth(req: Request, res: Response) {
  try {
    const loginService = container.resolve(LoginService);

    const user = await loginService.login({
      ...req.body,
      cpf: req.body.cpf.replace(/\D/g, ''),
    });

    return res.status(200).json(user);
  } catch (error: any) {
    return res
      .status(error.statusCode || 500)
      .json({ error: !error.message ? error : error.message });
  }
}

export async function logoff(req: Request, res: Response) {
  try {
    const loginService = container.resolve(LoginService);

    const token = req.headers.authorization?.replace('Bearer ', '') as string;

    await loginService.logout(token);

    return res.status(200).send({
      mensagem: 'Voce foi deslogado!',
    });
  } catch (error: any) {
    return res
      .status(error.statusCode || 500)
      .json({ error: !error.message ? error : error.message });
  }
}
