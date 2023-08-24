import Relfavorite from '../../database/entities/Relfavorite';

interface IRelfavoriteDTO {
  relatory_id: string;
  user_id: string;
}

interface IRelfavoriteReturnPagination {
  data: Relfavorite[];
  count: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
  lastPage: number;
}

export interface IRelfavoritesRepository {
  all(search: string,
    page: number,
    limit: number
  ): Promise<IRelfavoriteReturnPagination>;
  create(data: IRelfavoriteDTO): Promise<Relfavorite>;
  update(id: string, data: IRelfavoriteDTO): Promise<Relfavorite>;
  delete(id: string): Promise<void>;
  findOneById(id: string): Promise<Relfavorite | undefined>;
  findOneByName(name: string): Promise<Relfavorite | undefined>;
}
