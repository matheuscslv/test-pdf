import { compare } from 'bcryptjs';
import { inject, injectable, singleton } from 'tsyringe';

import User from '../../database/entities/User';
import { IProfileRepository } from '../../repositories/interfaces/IProfileRepository';
import { IUserRepository } from '../../repositories/interfaces/IUserRepository';
import { io } from '../../server';
import AppError from '../../utils/error';
import { Token } from '../../utils/token';

interface IRequest {
  contato: {
    celular: string;
    email: string;
    id: number;
  };
  cpf: string;
  nome: string;
  nome_social: string | null;
  access_token: string;
  password?: string;
}

@singleton()
@injectable()
class LoginService {
  constructor(
    // @ts-ignore
    @inject('UserRepository') private userRepository: IUserRepository,
    // @ts-ignore
    @inject('ProfileRepository') private profileRepository: IProfileRepository
  ) {}

  async login(data: IRequest): Promise<User> {
    let user = await this.userRepository.findOneByAllCPF(data.cpf);

    if (!data.nome && !user) {
      throw new AppError('Usuário e/ou senha inválidos!', 401);
    }

    if (!data.nome && user) {
      const match = await compare(data.password || '', user.senha);

      if (!match) {
        throw new AppError('Usuário e/ou senha inválidos!', 401);
      }
    }

    if (!user && data.nome) {
      const profile = await this.profileRepository.findOneByName(
        'Usuário Local'
      );

      user = await this.userRepository.create({
        nome: data.nome,
        cpf: data.cpf,
        email: data.contato.email,
        access_token: data.access_token,
        busca_avancada: 'F',
        emite_folha_antecedentes: 'F',
        busca_avancada_inrc: 'Nenhuma',
        profile_id: profile?.id || undefined,
      });
    }

    if (user) {
      if (data.nome) {
        await this.userRepository.update(user.id, {
          nome: data.nome,
          email: data.contato.email,
          access_token: data.access_token,
        });

        user = await this.userRepository.findOneByAllCPF(data.cpf);
      }

      if (user?.habilitado === 'F') {
        throw new AppError(
          'Usuário não possui permissão para se autenticar no sistema!',
          401
        );
      }

      if (user?.token) {
        io.emit('new-login-sisid', user);
      }
      // @ts-ignore
      const { cpf, id, nome } = user;
      const token = await Token.encode({ cpf, id, nome });
      const encoded = await Token.encodeAll({ ...user, token });
      await this.userRepository.updateToken(id, token);

      // @ts-ignore
      delete user.senha;
      return { ...user, token, encoded } as User;
    }

    throw new AppError('Erro ao executar serviço de autenticação!', 500);
  }

  async logout(token: string): Promise<void> {
    const user = await this.userRepository.findOneByToken(token);

    if (user) {
      await this.userRepository.updateToken(user.id, undefined);
    } else {
      throw new AppError('Usuário não identificado!', 404);
    }
  }
}

export { LoginService };
