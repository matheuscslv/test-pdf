import { getRepository, ILike, Not, Repository } from 'typeorm';

import Profile from '../database/entities/Profile';
import { IProfileRepository } from './interfaces/IProfileRepository';

interface IProfileDTO {
  nome?: string;
  perfil_pesquisa?: string;
  perfil_inrc?: string;
}

class ProfileRepository implements IProfileRepository {
  private repository: Repository<Profile>;
  constructor() {
    this.repository = getRepository(Profile);
  }

  async all(): Promise<Profile[]> {
    const users = await this.repository.find({
      select: ['id', 'nome', 'perfil_pesquisa', 'perfil_inrc'],
      /* where: {
        nome: Not('Administrador Master'),
      }, */
    });

    return users;
  }

  async findOneByName(name: string): Promise<Profile | undefined> {
    const user = await this.repository.findOne({
      select: ['id', 'nome', 'perfil_pesquisa', 'perfil_inrc'],
      where: {
        nome: ILike(`%${name}%`),
      },
    });

    return user;
  }

  async create(data: IProfileDTO): Promise<Profile> {
    let user = this.repository.create(data);
    user = await this.repository.save(user);
    return user;
  }

  async update(id: string, data: IProfileDTO): Promise<Profile> {
    await this.repository.update({ id }, data);

    const user = await this.repository.findOne({
      select: ['id', 'nome', 'perfil_pesquisa', 'perfil_inrc'],
      where: { id },
    });
    return user as Profile;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findOneById(id: string): Promise<Profile | undefined> {
    const user = await this.repository.findOne({ where: { id } });
    return user;
  }
}

export { ProfileRepository };
