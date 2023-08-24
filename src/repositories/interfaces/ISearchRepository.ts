import ISearch from '../../controllers/services/DTO/Search';

export interface ISearchRepository {
  findINRC(texto: string, dt_ocorrencia: string, dt_nascimento: string, quantidade_por_pagina: bigint, pagina_atual: bigint): Promise<ISearch>;
}
