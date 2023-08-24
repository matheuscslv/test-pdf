import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { InstitutionsService } from './services/InstitutionsService';

export async function index(req: Request, res: Response) {
  try {
    const institutionsService = container.resolve(InstitutionsService);
    const { page = 1, limit = 10, search = '' } = req.query;

    const institutions = await institutionsService.index(
      String(search),
      Number(page),
      Number(limit)
    );

    return res.status(200).json(institutions);
  } catch (error: any) {
    return res
      .status(error.statusCode || 500)
      .json({ error: !error.message ? error : error.message });
  }
}

export async function show(req: Request, res: Response) {
  try {
    const institutionsService = container.resolve(InstitutionsService);

    const institution = await institutionsService.show(req.params.id);

    return res.status(200).json(institution);
  } catch (error: any) {
    return res
      .status(error.statusCode || 500)
      .json({ error: !error.message ? error : error.message });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const institutionsService = container.resolve(InstitutionsService);

    const institutions = await institutionsService.create(req.body);

    return res.status(200).json(institutions);
  } catch (error: any) {
    return res
      .status(error.statusCode || 500)
      .json({ error: !error.message ? error : error.message });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const institutionsService = container.resolve(InstitutionsService);

    const institutions = await institutionsService.update(req.params.id, req.body);

    return res.status(200).json(institutions);
  } catch (error: any) {
    return res
      .status(error.statusCode || 500)
      .json({ error: !error.message ? error : error.message });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const institutionsService = container.resolve(InstitutionsService);
    await institutionsService.remove(req.params.id);

    return res.status(200).json({ message: 'Instituicao removida com sucesso!' });
  } catch (error: any) {
    return res
      .status(error.statusCode || 500)
      .json({ error: !error.message ? error : error.message });
  }
}
