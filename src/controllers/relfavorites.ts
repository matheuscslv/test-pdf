import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { RelfavoritesService } from './services/RelfavoritesService';

export async function index(req: Request, res: Response) {
  try {
    const relfavoritesService = container.resolve(RelfavoritesService);
    const { page = 1, limit = 10, user_id = '' } = req.query;

    const relfavorites = await relfavoritesService.index(
      String(user_id),
      Number(page),
      Number(limit)
    );

    return res.status(200).json(relfavorites);
  } catch (error: any) {
    return res
      .status(error.statusCode || 500)
      .json({ error: !error.message ? error : error.message });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const relfavoritesService = container.resolve(RelfavoritesService);

    const relfavorites = await relfavoritesService.create(req.body);

    return res.status(200).json(relfavorites);
  } catch (error: any) {
    return res
      .status(error.statusCode || 500)
      .json({ error: !error.message ? error : error.message });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const relfavoritesService = container.resolve(RelfavoritesService);

    const relfavorites = await relfavoritesService.update(req.params.id, req.body);

    return res.status(200).json(relfavorites);
  } catch (error: any) {
    return res
      .status(error.statusCode || 500)
      .json({ error: !error.message ? error : error.message });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const relfavoritesService = container.resolve(RelfavoritesService);
    await relfavoritesService.remove(req.params.id);

    return res.status(200).json({ message: 'Instituicao removida com sucesso!' });
  } catch (error: any) {
    return res
      .status(error.statusCode || 500)
      .json({ error: !error.message ? error : error.message });
  }
}
