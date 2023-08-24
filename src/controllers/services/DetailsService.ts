import { inject, injectable, singleton } from 'tsyringe';

import { IDetailsRepository } from '../../repositories/interfaces/IDetailsRepository';
import AppError from '../../utils/error';
import IDetails from './DTO/Details';
import { type } from 'os';

@singleton()
@injectable()
class DetailsService {
  constructor(
    // @ts-ignore
    @inject('DetailsRepository') private detailsRepository: IDetailsRepository
  ) {}

  async execute(rg: string): Promise<IDetails> {
    const result = await this.detailsRepository.findINRC(rg);

    if (!result) {
      throw new AppError('Informação não encontrada!', 404);
    }

    return result;
  }
}

export { DetailsService };
