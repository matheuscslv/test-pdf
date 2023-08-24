import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { RelatoriesService } from './services/RelatoriesService';

export async function index(req: Request, res: Response) {
  try {
    const relatoriesService = container.resolve(RelatoriesService);
    const { page = 1, limit = 10, user_id = '' } = req.query;

    const relatories = await relatoriesService.index(
      String(user_id),
      Number(page),
      Number(limit)
    );

    return res.status(200).json(relatories);
  } catch (error: any) {
    return res
      .status(error.statusCode || 500)
      .json({ error: !error.message ? error : error.message });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const relatoriesService = container.resolve(RelatoriesService);

    const relatories = await relatoriesService.create(req.body);

    return res.status(200).json(relatories);
  } catch (error: any) {
    return res
      .status(error.statusCode || 500)
      .json({ error: !error.message ? error : error.message });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const relatoriesService = container.resolve(RelatoriesService);

    const relatories = await relatoriesService.update(req.params.id, req.body);

    return res.status(200).json(relatories);
  } catch (error: any) {
    return res
      .status(error.statusCode || 500)
      .json({ error: !error.message ? error : error.message });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const relatoriesService = container.resolve(RelatoriesService);
    await relatoriesService.remove(req.params.id);

    return res.status(200).json({ message: 'Instituicao removida com sucesso!' });
  } catch (error: any) {
    return res
      .status(error.statusCode || 500)
      .json({ error: !error.message ? error : error.message });
  }
}

export async function search(req: Request, res: Response) {
  try {
    const relatoriesService = container.resolve(RelatoriesService);

    if (!req.body.texto) {
      return res.status(400).json({ error: 'Texto não informado' });
    }

    if (!req.body.user_id) {
      return res.status(400).json({ error: 'User_id não informado' });
    }

    if (req.body.texto.length < 3) {
      return res.status(400).json({ error: 'Texto deve ter no mínimo 3 caracteres' });
    }

    const relatories = await relatoriesService.search(req.body.texto, req.body.user_id);


    return res.status(200).json(relatories);
  } catch (error: any) {
    return res
      .status(error.statusCode || 500)
      .json({ error: !error.message ? error : error.message });
  }
}

export async function basicConfigGet(req: Request, res: Response) {
  try {
    const relatoriesService = container.resolve(RelatoriesService);

    const relatories = await relatoriesService.basicConfigGet();
    return res.status(200).json(relatories);
  } catch (error: any) {
    return res
      .status(error.statusCode || 500)
      .json({ error: !error.message ? error : error.message });
  }
}

export async function basicConfigSet(req: Request, res: Response) {
  try {
    const relatoriesService = container.resolve(RelatoriesService);

    if (req.body.campos.length < 1) {
      return res.status(400).json({ error: 'campos é um campo obrigatório' });
    }

    const relatories = await relatoriesService.basicConfigSet(String(req.body.campos));

    return res.status(200).json(relatories);
  } catch (error: any) {
    return res
      .status(error.statusCode || 500)
      .json({ error: !error.message ? error : error.message });
  }
}