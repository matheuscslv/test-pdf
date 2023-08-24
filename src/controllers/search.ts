import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { SearchService } from './services/SearchService';

export async function search(req: Request, res: Response) {
  try {
    const searchService = container.resolve(SearchService);

    if (!req.body.texto) {
      return res.status(400).json({ error: 'Texto não informado' });
    }

    if (req.body.texto.length < 3) {
      return res.status(400).json({ error: 'Texto deve ter no mínimo 3 caracteres' });
    }

    const result = await searchService.execute(
      req.body.texto,
      req.body.dt_ocorrencia,
      req.body.dt_nascimento,
      req.body.quantidade_por_pagina,
      req.body.pagina_atual,
      );

    return res.status(200).json(result);
  } catch (error: any) {
    return res
      .status(error.statusCode || 500)
      .json({ error: !error.message ? error : error.message });
  }
}
