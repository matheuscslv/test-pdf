import { inject, injectable, singleton } from 'tsyringe';

import Relfavorite from '../../database/entities/Relfavorite';
import { IRelfavoritesRepository } from '../../repositories/interfaces/IRelfavoritesRepository';
import AppError from '../../utils/error';

interface IRelfavoritesDTO {
  relatory_id: string;
  user_id: string;
}
interface IRelfavoritesReturnPagination {
  data: Relfavorite[];
  count: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
  lastPage: number;
}
@singleton()
@injectable()
class RelfavoritesService {
  constructor(
    // @ts-ignore
    @inject('RelfavoritesRepository') private relfavoritesRepository: IRelfavoritesRepository
  ) {}

  async index(search: string,
    page: number,
    limit: number
  ): Promise<IRelfavoritesReturnPagination> {
    const relfavoritess = await this.relfavoritesRepository.all(search,page,limit);

    return relfavoritess;
  }

  async create(data: IRelfavoritesDTO): Promise<Relfavorite> {
    const user = await this.relfavoritesRepository.create({
      relatory_id: data.relatory_id,
      user_id: data.user_id,
    });

    return user;
  }

  async update(id: string, data: IRelfavoritesDTO): Promise<Relfavorite> {
    const isRelfavoritesExists = await this.relfavoritesRepository.findOneById(id);

    if (!isRelfavoritesExists) {
      throw new AppError('Relfavorite não identificada!', 404);
    }

    const relfavorites = await this.relfavoritesRepository.update(id, data);

    return relfavorites;
  }

  async remove(id: string): Promise<void> {
    const isRelfavoritesExists = await this.relfavoritesRepository.findOneById(id);

    if (!isRelfavoritesExists) {
      throw new AppError('Relfavorite não identificada!', 404);
    }

    await this.relfavoritesRepository.delete(id);
  }
}

export { RelfavoritesService };
