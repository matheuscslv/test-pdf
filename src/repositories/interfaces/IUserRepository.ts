import User from '../../database/entities/User';

interface IUserUpdateDTO {
  nome?: string;
  email?: string;
  access_token?: string;
  busca_avancada?: string;
  emite_folha_antecedentes?: string;
  busca_avancada_civil?: string;
  busca_avancada_criminal?: string;
  busca_avancada_inrc?: string;
  busca_avancada_prisional?: string;
  senha?: string;
  profile_id?: string;
  institution_id?: string;
  is_created_gov?: string;
}

interface IUserCreateDTO {
  email: string;
  cpf: string;
  nome: string;
  busca_avancada: string;
  emite_folha_antecedentes: string;
  busca_avancada_inrc: string;
  access_token?: string;
  profile_id?: string;
  institution_id?: string;
}

interface IUserReturnPagination {
  data: User[];
  count: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
  lastPage: number;
}

export interface IUserRepository {
  all(): Promise<User[]>;
  findAllExceptUserLogged(
    userlogged: string,
    search: string,
    institution_id: string,
    profile_id: string,
    habilitado: string,
    page: number,
    limit: number,
    isReturnAdm: boolean,
    isReturnGestor: boolean
  ): Promise<IUserReturnPagination>;
  create(data: IUserCreateDTO): Promise<User>;
  update(id: string, data: IUserUpdateDTO): Promise<User>;
  delete(id: string): Promise<void>;
  findOneByToken(token: string): Promise<User | undefined>;
  findOneById(id: string): Promise<User | undefined>;
  findOneByCPF(cpf: string): Promise<User | undefined>;
  findOneByAllCPF(cpf: string): Promise<User | undefined>;
  updateToken(id: string, token: string | undefined): Promise<void>;
}
