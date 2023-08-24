import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { SolicitationService } from './services/SolicitationService';

export async function index(req: Request, res: Response) {
  try {
    const solicitationService = container.resolve(SolicitationService);

    const {
      page = 1,
      limit = 10,
      search = '',
      status,
      institution_id,
    } = req.query;

    const user = await solicitationService.index(
      String(status),
      String(institution_id),
      String(search),
      Number(page),
      Number(limit)
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
    const solicitationService = container.resolve(SolicitationService);

    const { page = 1, limit = 10, search = '', status } = req.query;

    const solicitation = await solicitationService.show(
      req.params.id,
      String(status),
      String(search),
      Number(page),
      Number(limit)
    );

    return res.status(200).json(solicitation);
  } catch (error: any) {
    return res
      .status(error.statusCode || 500)
      .json({ error: !error.message ? error : error.message });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const solicitationService = container.resolve(SolicitationService);

    const solicitation = await solicitationService.create({
      user_solicitation_id: req.userId,
      ...req.body,
    });

    return res.status(200).json(solicitation);
  } catch (error: any) {
    return res
      .status(error.statusCode || 500)
      .json({ error: !error.message ? error : error.message });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const solicitationService = container.resolve(SolicitationService);

    const solicitation = await solicitationService.update(req.params.id, {
      user_response_solicitation_id: req.userId,
      ...req.body,
    });

    return res.status(200).json(solicitation);
  } catch (error: any) {
    return res
      .status(error.statusCode || 500)
      .json({ error: !error.message ? error : error.message });
  }
}
