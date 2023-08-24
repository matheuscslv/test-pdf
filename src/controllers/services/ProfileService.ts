import { inject, injectable, singleton } from 'tsyringe';

import Profile from '../../database/entities/Profile';
import { IProfileRepository } from '../../repositories/interfaces/IProfileRepository';
import AppError from '../../utils/error';

interface IProfileDTO {
  nome?: string;
  perfil_pesquisa?: string;
  perfil_inrc?: string;
}

@singleton()
@injectable()
class ProfileService {
  constructor(
    // @ts-ignore
    @inject('ProfileRepository') private profileRepository: IProfileRepository
  ) {}

  async index(
    isReturnAdm: boolean,
    isReturnGestor: boolean,
    isMaster: boolean
  ): Promise<Profile[]> {
    const profiles = await this.profileRepository.all();

    if (isMaster) {
      return profiles;
    }

    if (!isReturnAdm) {
      if (!isReturnGestor) {
        return profiles.filter(
          (item) =>
            item.nome !== 'Administrador' &&
            item.nome !== 'Gestor' &&
            item.nome !== 'Administrador Master'
        );
      }

      return profiles.filter(
        (item) =>
          item.nome !== 'Administrador' && item.nome !== 'Administrador Master'
      );
    }

    return profiles.filter((item) => item.nome !== 'Administrador Master');
  }

  async show(id: string): Promise<Profile | undefined> {
    const profile = await this.profileRepository.findOneById(id);

    if (!profile) {
      throw new AppError('Perfil não identificado!', 404);
    }

    return profile;
  }

  async create(data: IProfileDTO): Promise<Profile> {
    const isProfileExists = await this.profileRepository.findOneByName(String(data.nome));

    if (!isProfileExists) {
      const user = await this.profileRepository.create({
        nome: data.nome,
        perfil_pesquisa: data.perfil_pesquisa,
        perfil_inrc: data.perfil_inrc,
      });
      return user;
    } else {
      throw new AppError('Perfil já cadastrado!', 409);
    }

    return {} as Profile;
  }

  async update(id: string, data: IProfileDTO): Promise<Profile> {
    const isProfileExists = await this.profileRepository.findOneById(id);

    if (!isProfileExists) {
      throw new AppError('Perfil não identificado!', 404);
    }

    const isProfileExists2 = await this.profileRepository.findOneByName(String(data.nome));
    if (isProfileExists2 && isProfileExists2?.id !== id) {
      throw new AppError('Perfil já cadastrado!', 409);
    }

    const profile = await this.profileRepository.update(id, data);

    return profile;
  }

  async remove(id: string): Promise<void> {
    const isProfileExists = await this.profileRepository.findOneById(id);

    if (!isProfileExists) {
      throw new AppError('Perfil não identificado!', 404);
    }

    await this.profileRepository.delete(id);
  }
}

export { ProfileService };
