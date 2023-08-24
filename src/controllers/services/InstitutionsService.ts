import { inject, injectable, singleton } from 'tsyringe';

import Institution from '../../database/entities/Institution';
import { IInstitutionsRepository } from '../../repositories/interfaces/IInstitutionsRepository';
import AppError from '../../utils/error';

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
@singleton()
@injectable()
class InstitutionsService {
  constructor(
    // @ts-ignore
    @inject('InstitutionsRepository') private institutionsRepository: IInstitutionsRepository
  ) { }

  async index(search: string,
    page: number,
    limit: number
  ): Promise<IInstitutionsReturnPagination> {
    const institutionss = await this.institutionsRepository.all(search, page, limit);

    return institutionss;
  }

  async show(id: string): Promise<Institution | undefined> {
    const institution = await this.institutionsRepository.findOneById(id);

    if (!institution) {
      throw new AppError('Instituicao não identificada!', 404);
    }

    return institution;
  }

  async create(data: IInstitutionsDTO): Promise<Institution> {
    const user = await this.institutionsRepository.create({
      nome: data.nome,
      status: data.status,
      sigla: data.sigla,
      site: data.site,
      descricao: data.descricao,
    });

    return user;
  }

  async update(id: string, data: IInstitutionsDTO): Promise<Institution> {
    const isInstitutionsExists = await this.institutionsRepository.findOneById(id);

    if (!isInstitutionsExists) {
      throw new AppError('Instituicao não identificada!', 404);
    }

    const institutions = await this.institutionsRepository.update(id, data);

    return institutions;
  }

  async remove(id: string): Promise<void> {
    const isInstitutionsExists = await this.institutionsRepository.findOneById(id);

    if (!isInstitutionsExists) {
      throw new AppError('Instituicao não identificada!', 404);
    }

    await this.institutionsRepository.delete(id);
  }
}

export { InstitutionsService };
