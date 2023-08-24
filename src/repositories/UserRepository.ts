import bcrypt from 'bcryptjs';
import { getRepository, Repository, Not, IsNull, ILike, Raw } from 'typeorm';

import User from '../database/entities/User';
import { IUserRepository } from './interfaces/IUserRepository';

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

class UserRepository implements IUserRepository {
  private repository: Repository<User>;
  constructor() {
    this.repository = getRepository(User);
  }

  async all(): Promise<User[]> {
    const users = await this.repository.find({
      select: [
        'id',
        'nome',
        'cpf',
        'email',
        'busca_avancada',
        'busca_avancada_civil',
        'busca_avancada_criminal',
        'busca_avancada_inrc',
        'busca_avancada_prisional',
        'emite_folha_antecedentes',
        'habilitado',
        'profile_id',
        'institution_id',
      ],
      where: {
        deleted_at: IsNull(),
        is_created_gov: 'T',
        perfil: {
          nome: Not('Administrador Master'),
        },
      },
      relations: ['perfil', 'instituicao'],
    });

    return users;
  }

  async findAllExceptUserLogged(
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
    const take = limit;
    const skip = (page - 1) * take;

    const user = await this.repository.findOne({
      where: { id: userlogged },
      relations: ['perfil'],
    });

    const [users, total] = await this.repository.findAndCount({
      select: [
        'id',
        'nome',
        'cpf',
        'email',
        'busca_avancada',
        'busca_avancada_civil',
        'busca_avancada_criminal',
        'busca_avancada_inrc',
        'busca_avancada_prisional',
        'emite_folha_antecedentes',
        'habilitado',
        'profile_id',
        'institution_id',
      ],
      where: {
        id: Not(userlogged),
        deleted_at: IsNull(),
        is_created_gov: 'T',
        nome: ILike(`%${search}%`),
        ...(institution_id !== 'undefined' &&
          institution_id !== '' && {
            institution_id,
          }),
        ...(habilitado !== 'undefined' &&
          habilitado !== '' && {
            habilitado,
          }),
        perfil: {
          ...(profile_id !== 'undefined' &&
            profile_id !== '' && {
              id: profile_id,
            }),
          ...(user?.perfil.nome === 'Administrador Master'
            ? {
                nome: ILike(`%%`),
              }
            : {
                nome: Raw((alias) =>
                  // eslint-disable-next-line no-nested-ternary
                  !isReturnAdm
                    ? !isReturnGestor
                      ? `${alias} <> 'Administrador Master' and ${alias} <> 'Administrador' and ${alias} <> 'Gestor'`
                      : `${alias} <> 'Administrador Master' and ${alias} <> 'Administrador'`
                    : `${alias} <> 'Administrador Master'`
                ),
              }),
          /* nome: Raw((alias) =>
            !isReturnAdm
              ? `${alias} <> 'Administrador Master' and ${alias} <> 'Administrador'`
              : `${alias} <> 'Administrador Master'`
          ), */
        },
      },
      order: { nome: 'ASC' },
      take,
      skip,
      relations: ['perfil', 'instituicao'],
    });

    const lastPage = Math.ceil(total / limit);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;

    return {
      data: users,
      count: total,
      currentPage: page,
      nextPage,
      prevPage,
      lastPage,
    };
  }

  async create(data: IUserCreateDTO): Promise<User> {
    const saltRounds = 10;
    const password = '86f90359326dc55580391beacf30bab7';
    const newPass = await bcrypt.hash(password, saltRounds);

    let user = this.repository.create({ ...data, senha: newPass });
    user = await this.repository.save(user);

    const final_user = await this.repository.findOne({
      select: [
        'id',
        'nome',
        'cpf',
        'email',
        'busca_avancada',
        'busca_avancada_civil',
        'busca_avancada_criminal',
        'busca_avancada_inrc',
        'busca_avancada_prisional',
        'emite_folha_antecedentes',
        'habilitado',
        'profile_id',
        'institution_id',
      ],
      where: { id: user.id },
      relations: ['perfil', 'instituicao'],
    });
    return final_user as User;
  }

  async update(id: string, data: IUserUpdateDTO): Promise<User> {
    if (data?.senha) {
      const saltRounds = 10;
      const { senha } = data;
      const newPass = await bcrypt.hash(senha, saltRounds);
      await this.repository.update({ id }, { ...data, senha: newPass });
    } else {
      await this.repository.update({ id }, data);
    }

    const user = await this.repository.findOne({
      select: [
        'id',
        'nome',
        'cpf',
        'email',
        'busca_avancada',
        'busca_avancada_civil',
        'busca_avancada_criminal',
        'busca_avancada_inrc',
        'busca_avancada_prisional',
        'emite_folha_antecedentes',
        'habilitado',
        'profile_id',
        'institution_id',
      ],
      where: { id },
      relations: ['perfil', 'instituicao'],
    });
    return user as User;
  }

  async delete(id: string): Promise<void> {
    // await this.repository.delete(id);
    await this.repository.update(
      { id },
      {
        deleted_at: new Date().toISOString(),
      }
    );
  }

  async findOneByToken(token: string): Promise<User | undefined> {
    const user = await this.repository.findOne({
      where: { token },
      relations: ['perfil', 'instituicao'],
    });
    return user;
  }

  async findOneById(id: string): Promise<User | undefined> {
    const user = await this.repository.findOne({
      where: { id },
      relations: ['perfil', 'instituicao'],
    });
    return user;
  }

  async findOneByCPF(cpf: string): Promise<User | undefined> {
    const user = await this.repository.findOne({
      where: {
        cpf,
        is_created_gov: 'F',
      },
      relations: ['perfil', 'instituicao'],
    });
    return user;
  }

  async findOneByAllCPF(cpf: string): Promise<User | undefined> {
    const user = await this.repository.findOne({
      where: {
        cpf,
      },
      relations: ['perfil', 'instituicao'],
    });
    return user;
  }

  async updateToken(id: string, token: string | undefined): Promise<void> {
    await this.repository.update({ id }, { token, access_token: undefined });
  }
}

export { UserRepository };
