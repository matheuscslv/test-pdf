import { inject, injectable, singleton } from 'tsyringe';

import { IImagesRepository } from '../../repositories/interfaces/IImagesRepository';
import AppError from '../../utils/error';
import IImages from './DTO/Images';
import { type } from 'os';

@singleton()
@injectable()
class ImagesService {
  constructor(
    // @ts-ignore
    @inject('ImagesRepository') private imagesRepository: IImagesRepository
  ) {}

  async execute(rg: string): Promise<IImages> {
    const result = await this.imagesRepository.findINRC(rg);

    if (!result) {
      throw new AppError('Informação não encontrada!', 404);
    }

    return result;
  }
}

export { ImagesService };
