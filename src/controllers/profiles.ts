import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ProfileService } from './services/ProfileService';

export async function index(req: Request, res: Response) {
  try {
    const profileService = container.resolve(ProfileService);

    const { isReturnAdm, isReturnGestor, isMaster } = req.query;

    const profile = await profileService.index(
      String(isReturnAdm) === 'true',
      String(isReturnGestor) === 'true',
      String(isMaster) === 'true'
    );

    return res.status(200).json(profile);
  } catch (error: any) {
    return res
      .status(error.statusCode || 500)
      .json({ error: !error.message ? error : error.message });
  }
}

export async function show(req: Request, res: Response) {
  try {
    const profileService = container.resolve(ProfileService);

    const profile = await profileService.show(req.body.id);

    return res.status(200).json(profile);
  } catch (error: any) {
    return res
      .status(error.statusCode || 500)
      .json({ error: !error.message ? error : error.message });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const profileService = container.resolve(ProfileService);

    const profile = await profileService.create(req.body);

    return res.status(200).json(profile);
  } catch (error: any) {
    return res
      .status(error.statusCode || 500)
      .json({ error: !error.message ? error : error.message });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const profileService = container.resolve(ProfileService);

    const profile = await profileService.update(req.params.id, req.body);

    return res.status(200).json(profile);
  } catch (error: any) {
    return res
      .status(error.statusCode || 500)
      .json({ error: !error.message ? error : error.message });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const profileService = container.resolve(ProfileService);

    await profileService.remove(req.params.id);

    return res.status(200).json({ message: 'Perfil removido com sucesso!' });
  } catch (error: any) {
    return res
      .status(error.statusCode || 500)
      .json({ error: !error.message ? error : error.message });
  }
}
