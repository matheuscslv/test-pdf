import Solicitation from '../../database/entities/Solicitation';

interface ICreateSolicitationDTO {
  request_fac?: string;
  request_busca_avancada?: string;
  request_busca_avancada_civil?: string;
  request_busca_avancada_criminal?: string;
  request_busca_avancada_inrc?: string;
  request_busca_avancada_prisional?: string;
  status?: string;
  data_solicitacao?: string;
}

interface IUpdateSolicitationDTO {
  request_fac?: string;
  request_busca_avancada?: string;
  request_busca_avancada_civil?: string;
  request_busca_avancada_criminal?: string;
  request_busca_avancada_inrc?: string;
  request_busca_avancada_prisional?: string;
  status?: string;
  data_resposta_solicitacao?: string;
  observacao?: string;
  deleted_at?: string | undefined;
}

interface ISolicitationReturnPagination {
  data: Solicitation[];
  count: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
  lastPage: number;
}

export interface ISolicitationRepository {
  all(
    status: string,
    institution_id: string,
    search: string,
    page: number,
    limit: number
  ): Promise<ISolicitationReturnPagination>;
  create(data: ICreateSolicitationDTO): Promise<Solicitation>;
  update(id: string, data: IUpdateSolicitationDTO): Promise<Solicitation>;
  findOneById(id: string): Promise<Solicitation | undefined>;
  findOneByUserId(
    id: string,
    status: string,
    search: string,
    page: number,
    limit: number
  ): Promise<ISolicitationReturnPagination>;
}
