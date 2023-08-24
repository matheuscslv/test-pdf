import RelatoryConfig from 'database/entities/RelatoryConfig';
import Relatory from '../../database/entities/Relatory';

interface IRelatoryDTO {
  nome: string;
  campos?: string;
  user_id: string;
  institution_id: string;
  deleted?: boolean;
}

interface IRelatoryReturnPagination {
  data: Relatory[];
  count: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
  lastPage: number;
}

export interface IRelatoriesRepository {
  all(search: string,
    page: number,
    limit: number
  ): Promise<IRelatoryReturnPagination>;
  create(data: IRelatoryDTO): Promise<Relatory>;
  update(id: string, data: IRelatoryDTO): Promise<Relatory>;
  search(search: string, user_id: string): Promise<Relatory[]>;
  delete(id: string): Promise<void>;
  getConfig(): Promise<RelatoryConfig>;
  setConfig(campos: string): Promise<RelatoryConfig>;
  findOneById(id: string): Promise<Relatory | undefined>;
  findOneByName(name: string): Promise<Relatory | undefined>;
}
