import { getRepository, Repository, Not, IsNull, ILike, Raw } from 'typeorm';

import Relatory from '../database/entities/Relatory';
import { IRelatoriesRepository } from './interfaces/IRelatoriesRepository';
import RelatoryConfig from '../database/entities/RelatoryConfig';

interface IRelatoriesDTO {
  nome: string;
  campos?: string;
  user_id: string;
  institution_id: string;
  deleted?: boolean;
}

interface IRelatoriesReturnPagination {
  data: Relatory[];
  count: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
  lastPage: number;
}

class RelatoriesRepository implements IRelatoriesRepository {
  private repository: Repository<Relatory>;
  private configRepository: Repository<RelatoryConfig>;

  constructor() {
    this.repository = getRepository(Relatory);
    this.configRepository = getRepository(RelatoryConfig);
  }

  async all(search: string, page: number, limit: number): Promise<IRelatoriesReturnPagination> {
    const take = limit;
    const skip = (page - 1) * take;

    const [users, total] = await this.repository.findAndCount({
      select: ['id', 'nome', 'campos', 'user_id', 'institution_id', 'deleted'],
      where: {
        deleted_at: IsNull(),
        ...(search && { user_id: search }),
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

  async search(search: string, user_id: string): Promise<Relatory[]> {

    const limit = 10;

    const [users, total] = await this.repository.findAndCount({
      select: ['id', 'nome', 'campos', 'user_id', 'institution_id', 'deleted'],
      where: {
        deleted_at: IsNull(),
        nome: ILike(`%${search}%`),
        user_id: user_id,
      },
      order: { nome: 'ASC' },
      take: limit,
    });

    return users;
  }

  async findOneByName(name: string): Promise<Relatory | undefined> {
    const user = await this.repository.findOne({
      select: ['id', 'nome', 'campos', 'user_id', 'institution_id', 'deleted'],
      where: {
        nome: ILike(`%${name}%`),
      },
    });

    return user;
  }

  async create(data: IRelatoriesDTO): Promise<Relatory> {
    let user = this.repository.create(data);
    user = await this.repository.save(user);
    return user;
  }

  async update(id: string, data: IRelatoriesDTO): Promise<Relatory> {
    await this.repository.update({ id }, data);

    const user = await this.repository.findOne({
      select: ['id', 'nome', 'campos', 'user_id', 'institution_id', 'deleted'],
      where: { id },
    });
    return user as Relatory;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findOneById(id: string): Promise<Relatory | undefined> {
    const user = await this.repository.findOne({ where: { id } });
    return user as Relatory;
  }

  async getConfig(): Promise<RelatoryConfig> {
    const config = await this.configRepository.findOne();

    if (!config) {
      const newConfig = this.configRepository.create({
        campos: 'nome,cpf,rg,endereco',
      });
      await this.configRepository.save(newConfig);
      return newConfig;
    } else {
      return config;
    }
  }

  async setConfig(campos: string): Promise<RelatoryConfig> {
    const config = await this.configRepository.findOne();

    if (!config) {
      const newConfig = this.configRepository.create({
        campos: campos,
      });
      await this.configRepository.save(newConfig);
      return newConfig;
    } else {
      await this.configRepository.update({ id: config.id }, { campos: campos });
      const newConfig = await this.configRepository.findOne();
      return newConfig as RelatoryConfig;
    }

  }
}

export { RelatoriesRepository };
