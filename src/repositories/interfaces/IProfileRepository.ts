import Profile from '../../database/entities/Profile';

interface IProfileDTO {
  nome?: string;
  perfil_pesquisa?: string;
  perfil_inrc?: string;
}

export interface IProfileRepository {
  all(): Promise<Profile[]>;
  create(data: IProfileDTO): Promise<Profile>;
  update(id: string, data: IProfileDTO): Promise<Profile>;
  delete(id: string): Promise<void>;
  findOneById(id: string): Promise<Profile | undefined>;
  findOneByName(name: string): Promise<Profile | undefined>;
}
