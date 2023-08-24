import { getRepository, Repository, Not, IsNull, ILike, Raw } from 'typeorm';

import Institution from '../database/entities/Institution';
import User from '../database/entities/User';
import { IInstitutionsRepository } from './interfaces/IInstitutionsRepository';

interface IInstitutionsDTO {
  nome?: string;
  status?: boolean;
  sigla?: string;
  site?: string;
  descricao?: string;
}

interface IInstitutionsReturnPagination {
  data: Institution[];
  count: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
  lastPage: number;
}

class InstitutionsRepository implements IInstitutionsRepository {
  private repository: Repository<Institution>;
  constructor() {
    this.repository = getRepository(Institution);
  }

  async all(search: string, page: number, limit: number): Promise<IInstitutionsReturnPagination> {
    const take = limit;
    const skip = (page - 1) * take;

    const [users, total] = await this.repository.findAndCount({
      select: ['id', 'nome', 'status', 'sigla', 'site', 'descricao'],
      where: {
        deleted_at: IsNull(),
        nome: ILike(`%${search}%`),
      },
      order: { nome: 'ASC' },
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

  async findOneByName(name: string): Promise<Institution | undefined> {
    const user = await this.repository.findOne({
      select: ['id', 'nome', 'status', 'sigla', 'site', 'descricao'],
      where: {
        nome: ILike(`%${name}%`),
      },
    });

    return user;
  }

  async create(data: IInstitutionsDTO): Promise<Institution> {
    let user = this.repository.create(data);
    user = await this.repository.save(user);
    return user;
  }

  async update(id: string, data: IInstitutionsDTO): Promise<Institution> {
    await this.repository.update({ id }, data);

    if (data?.status === false) {
      const userRepository = getRepository(User);
      const users = await userRepository.find({
        where: {
          institution_id: id,
        },
      });

      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < users.length; i++) {
        // eslint-disable-next-line no-await-in-loop
        await userRepository.update(
          { id: users[i].id },
          {
            habilitado: 'F',
          }
        );
      }
    }

    if (data?.status === true) {
      const userRepository = getRepository(User);
      const users = await userRepository.find({
        where: {
          institution_id: id,
        },
      });

      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < users.length; i++) {
        // eslint-disable-next-line no-await-in-loop
        await userRepository.update(
          { id: users[i].id },
          {
            habilitado: 'T',
          }
        );
      }
    }

    const user = await this.repository.findOne({
      select: ['id', 'nome', 'status', 'sigla', 'site', 'descricao'],
      where: { id },
    });
    return user as Institution;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findOneById(id: string): Promise<Institution | undefined> {
    const user = await this.repository.findOne({ where: { id } });
    return user as Institution;
  }
}

export { InstitutionsRepository };
