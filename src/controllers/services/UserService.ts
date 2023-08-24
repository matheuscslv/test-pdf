import { inject, injectable, singleton } from 'tsyringe';

import User from '../../database/entities/User';
import { IUserRepository } from '../../repositories/interfaces/IUserRepository';
import { io } from '../../server';
import AppError from '../../utils/error';
import { Token } from '../../utils/token';

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

@singleton()
@injectable()
class UserService {
  constructor(
    // @ts-ignore
    @inject('UserRepository') private userRepository: IUserRepository
  ) {}

  async index(
    userlogged: string,
    search: string,
    institution_id: string,
    profile_id: string,
    habilitado: string,
    page: number,
    limit: number,
    isReturnAdm: boolean,
    isReturnGestor: boolean
  ): Promise<IUserReturnPagination> {
    const users = await this.userRepository.findAllExceptUserLogged(
      userlogged,
      search,
      institution_id,
      profile_id,
      habilitado,
      page,
      limit,
      isReturnAdm,
      isReturnGestor
    );

    return users;
  }

  async show(cpf: string): Promise<User | undefined> {
    const user = await this.userRepository.findOneByCPF(cpf);

    if (!user) {
      throw new AppError('Usuário não identificado!', 404);
    }

    return user;
  }

  async userlogged(id: string): Promise<User | undefined> {
    const user = await this.userRepository.findOneById(id);
    const encoded = await Token.encodeAll({ ...user });

    if (!user) {
      throw new AppError('Usuário não identificado!', 404);
    }

    return { ...user, encoded } as User;
  }

  async create(data: IUserCreateDTO): Promise<User> {
    const user = await this.userRepository.create({
      nome: data.nome,
      cpf: data.cpf,
      email: data.email,
      busca_avancada: data.busca_avancada,
      emite_folha_antecedentes: data.emite_folha_antecedentes,
      busca_avancada_inrc: data.busca_avancada_inrc,
      profile_id: data.profile_id,
      institution_id: data?.institution_id || undefined,
    });

    return user;
  }

  async update(id: string, data: IUserUpdateDTO): Promise<User> {
    const isUserExists = await this.userRepository.findOneById(id);

    if (!isUserExists) {
      throw new AppError('Usuário não identificado!', 404);
    }

    const user = await this.userRepository.update(id, {
      ...data,
      // eslint-disable-next-line no-nested-ternary
      institution_id: data?.institution_id
        ? data?.institution_id === '-'
          ? undefined
          : data?.institution_id
        : isUserExists.institution_id,
    });

    const encoded = await Token.encodeAll({ ...user });
    io.emit('new-update-user', { ...user, encoded });

    return user;
  }

  async remove(id: string): Promise<void> {
    const isUserExists = await this.userRepository.findOneById(id);

    if (!isUserExists) {
      throw new AppError('Usuário não identificado!', 404);
    }

    await this.userRepository.delete(id);
  }
}

export { UserService };
