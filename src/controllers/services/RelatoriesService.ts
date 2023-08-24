import { inject, injectable, singleton } from 'tsyringe';

import Relatory from '../../database/entities/Relatory';
import { IRelatoriesRepository } from '../../repositories/interfaces/IRelatoriesRepository';
import AppError from '../../utils/error';
import RelatoryConfig from 'database/entities/RelatoryConfig';

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
@singleton()
@injectable()
class RelatoriesService {
  constructor(
    // @ts-ignore
    @inject('RelatoriesRepository') private relatoriesRepository: IRelatoriesRepository
  ) { }

  async index(search: string,
    page: number,
    limit: number
  ): Promise<IRelatoriesReturnPagination> {
    const relatoriess = await this.relatoriesRepository.all(search, page, limit);

    return relatoriess;
  }

  async create(data: IRelatoriesDTO): Promise<Relatory> {
    const user = await this.relatoriesRepository.create({
      nome: data.nome,
      campos: data.campos,
      user_id: data.user_id,
      institution_id: data.institution_id,
      deleted: data.deleted,
    });

    return user;
  }

  async update(id: string, data: IRelatoriesDTO): Promise<Relatory> {
    const isRelatoriesExists = await this.relatoriesRepository.findOneById(id);

    if (!isRelatoriesExists) {
      throw new AppError('Relatorio não identificado!', 404);
    }

    const relatories = await this.relatoriesRepository.update(id, data);

    return relatories;
  }

  async remove(id: string): Promise<void> {
    const isRelatoriesExists = await this.relatoriesRepository.findOneById(id);

    if (!isRelatoriesExists) {
      throw new AppError('Relatorio não identificado!', 404);
    }

    await this.relatoriesRepository.delete(id);
  }

  async search(search: string, user_id: string): Promise<Relatory[]> {
    const relatories = await this.relatoriesRepository.search(search, user_id);

    return relatories;
  }

  async basicConfigGet(): Promise<RelatoryConfig> {
    const relatoryConfig = await this.relatoriesRepository.getConfig();
    return relatoryConfig;
  }


  async basicConfigSet(campos: string): Promise<RelatoryConfig> {
    const relatoryConfig = await this.relatoriesRepository.setConfig(campos);
    return relatoryConfig;
  }

}

export { RelatoriesService };
