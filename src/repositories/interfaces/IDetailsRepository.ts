import IDetails from '../../controllers/services/DTO/Details';

export interface IDetailsRepository {
  findINRC(rg: string): Promise<IDetails>;
}
