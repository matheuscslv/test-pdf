import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UserService } from './services/UserService';

export async function index(req: Request, res: Response) {
  try {
    const userService = container.resolve(UserService);

    const {
      page = 1,
      limit = 10,
      search = '',
      institution_id,
      profile_id,
      habilitado,
      isReturnAdm,
      isReturnGestor,
    } = req.query;

    const user = await userService.index(
      req.userId,
      String(search),
      String(institution_id),
      String(profile_id),
      String(habilitado),
      Number(page),
      Number(limit),
      String(isReturnAdm) === 'true',
      String(isReturnGestor) === 'true'
    );

    return res.status(200).json(user);
  } catch (error: any) {
    return res
      .status(error.statusCode || 500)
      .json({ error: !error.message ? error : error.message });
  }
}

export async function show(req: Request, res: Response) {
  try {
    const userService = container.resolve(UserService);

    const user = await userService.show(req.params.cpf);

    return res.status(200).json(user);
  } catch (error: any) {
    return res
      .status(error.statusCode || 500)
      .json({ error: !error.message ? error : error.message });
  }
}

export async function userlogged(req: Request, res: Response) {
  try {
    const userService = container.resolve(UserService);

    const user = await userService.userlogged(req.userId);

    return res.status(200).json(user);
  } catch (error: any) {
    return res
      .status(error.statusCode || 500)
      .json({ error: !error.message ? error : error.message });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const userService = container.resolve(UserService);

    const user = await userService.create({
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

export async function update(req: Request, res: Response) {
  try {
    const userService = container.resolve(UserService);

    const user = await userService.update(req.params.id, req.body);

    return res.status(200).json(user);
  } catch (error: any) {
    return res
      .status(error.statusCode || 500)
      .json({ error: !error.message ? error : error.message });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const userService = container.resolve(UserService);

    await userService.remove(req.params.id);

    return res.status(200).json({ message: 'Usuário removido com sucesso!' });
  } catch (error: any) {
    return res
      .status(error.statusCode || 500)
      .json({ error: !error.message ? error : error.message });
  }
}
