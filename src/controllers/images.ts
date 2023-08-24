import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ImagesService } from './services/ImagesService';

export async function images(req: Request, res: Response) {
  try {
    const imagesService = container.resolve(ImagesService);

    if (!req.body.rg) {
      return res.status(400).json({ error: 'RG não informado' });
    }

    if (req.body.rg.length < 4) {
      return res.status(400).json({ error: 'RG deve ter no mínimo 4 caracteres' });
    }

    const result = await imagesService.execute(req.body.rg);

    return res.status(200).json(result);
  } catch (error: any) {
    return res
      .status(error.statusCode || 500)
      .json({ error: !error.message ? error : error.message });
  }
}
