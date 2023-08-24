import { inject, injectable, singleton } from 'tsyringe';

import { ISearchRepository } from '../../repositories/interfaces/ISearchRepository';
import AppError from '../../utils/error';
import ISearch from './DTO/Search';
import { type } from 'os';

@singleton()
@injectable()
class SearchService {
  constructor(
    // @ts-ignore
    @inject('SearchRepository') private searchRepository: ISearchRepository
  ) {}

  async execute(texto: string, dt_ocorrencia: string, dt_nascimento: string, quantidade_por_pagina: bigint, pagina_atual: bigint): Promise<ISearch> {

    const result = await this.searchRepository.findINRC(texto, dt_ocorrencia, dt_nascimento, quantidade_por_pagina, pagina_atual);

    if (!result) {
      throw new AppError('Informação não encontrada!', 404);
    }

    return result;
  }
}

export { SearchService };
