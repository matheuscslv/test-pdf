import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { DetailsService } from './services/DetailsService';

export async function details(req: Request, res: Response) {
  try {
    const detailsService = container.resolve(DetailsService);

    if (!req.body.rg) {
      return res.status(400).json({ error: 'RG não informado' });
    }

    if (req.body.rg.length < 4) {
      return res.status(400).json({ error: 'RG deve ter no mínimo 4 caracteres' });
    }

    const result = await detailsService.execute(req.body.rg);

    return res.status(200).json(result);
  } catch (error: any) {
    return res
      .status(error.statusCode || 500)
      .json({ error: !error.message ? error : error.message });
  }
}
