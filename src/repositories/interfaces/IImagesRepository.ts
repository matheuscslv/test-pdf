import IImages from '../../controllers/services/DTO/Images';

export interface IImagesRepository {
  findINRC(rg: string): Promise<IImages>;
}
