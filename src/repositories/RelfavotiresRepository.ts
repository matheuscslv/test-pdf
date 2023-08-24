import { getRepository, Repository, Not, IsNull, ILike, Raw } from 'typeorm';

import Relfavorite from '../database/entities/Relfavorite';
import { IRelfavoritesRepository } from './interfaces/IRelfavoritesRepository';

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

class RelfavoritesRepository implements IRelfavoritesRepository {
  private repository: Repository<Relfavorite>;
  constructor() {
    this.repository = getRepository(Relfavorite);
  }

  async all(search: string, page: number, limit: number): Promise<IRelfavoritesReturnPagination> {
    const take = limit;
    const skip = (page - 1) * take;

    const [users, total] = await this.repository.findAndCount({
      select: ['id', 'relatory_id', 'user_id'],
      where: {
        deleted_at: IsNull(),
        ...(search && { user_id: search }),
      },
      take,
      skip,
    });

    const lastPage = Math.ceil(total / limit);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;


    return {
      data: users,
      count: total,
      currentPage: page,
      nextPage,
      prevPage,
      lastPage,
    };
  }

  async findOneByName(name: string): Promise<Relfavorite | undefined> {
    const user = await this.repository.findOne({
      select: ['id', 'relatory_id', 'user_id'],
      where: {
        nome: ILike(`%${name}%`),
      },
    });

    return user;
  }

  async create(data: IRelfavoritesDTO): Promise<Relfavorite> {
    let user = this.repository.create(data);
    user = await this.repository.save(user);
    return user;
  }

  async update(id: string, data: IRelfavoritesDTO): Promise<Relfavorite> {
    await this.repository.update({ id }, data);

    const user = await this.repository.findOne({
      select: ['id', 'relatory_id', 'user_id'],
      where: { id },
    });
    return user as Relfavorite;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findOneById(id: string): Promise<Relfavorite | undefined> {
    const user = await this.repository.findOne({ where: { id } });
    return user as Relfavorite;
  }
}

export { RelfavoritesRepository };
