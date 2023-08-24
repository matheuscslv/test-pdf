import Institution from '../../database/entities/Institution';

interface IInstitutionDTO {
  nome?: string;
  status?: boolean;
  sigla?: string;
  site?: string;
  descricao?: string;
}

interface IInstitutionReturnPagination {
  data: Institution[];
  count: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
  lastPage: number;
}

export interface IInstitutionsRepository {
  all(search: string,
    page: number,
    limit: number
  ): Promise<IInstitutionReturnPagination>;
  create(data: IInstitutionDTO): Promise<Institution>;
  update(id: string, data: IInstitutionDTO): Promise<Institution>;
  delete(id: string): Promise<void>;
  findOneById(id: string): Promise<Institution | undefined>;
  findOneByName(name: string): Promise<Institution | undefined>;
}
