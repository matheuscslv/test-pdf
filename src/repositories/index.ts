import { container } from 'tsyringe';

import { DetailsRepository } from './DetailsRepository';
import { ImagesRepository } from './ImagesRepository';
import { InstitutionsRepository } from './InstitutionsRepository';
import { IDetailsRepository } from './interfaces/IDetailsRepository';
import { IImagesRepository } from './interfaces/IImagesRepository';
import { IInstitutionsRepository } from './interfaces/IInstitutionsRepository';
import { IProfileRepository } from './interfaces/IProfileRepository';
import { ISearchRepository } from './interfaces/ISearchRepository';
import { ISolicitationRepository } from './interfaces/ISolicitationRepository';
import { IUserRepository } from './interfaces/IUserRepository';
import { ProfileRepository } from './ProfileRepository';
import { SearchRepository } from './SearchRepository';
import { SolicitationRepository } from './SolicitationRepository';
import { UserRepository } from './UserRepository';
import { IRelatoriesRepository } from './interfaces/IRelatoriesRepository';
import { RelatoriesRepository } from './RelatoriesRepository';
import { IRelfavoritesRepository } from './interfaces/IRelfavoritesRepository';
import { RelfavoritesRepository } from './RelfavotiresRepository';

container.registerSingleton<IUserRepository>('UserRepository', UserRepository);
container.registerSingleton<ISolicitationRepository>(
  'SolicitationRepository',
  SolicitationRepository
);
container.registerSingleton<IProfileRepository>(
  'ProfileRepository',
  ProfileRepository
);
container.registerSingleton<ISearchRepository>(
  'SearchRepository',
  SearchRepository
);
container.registerSingleton<IDetailsRepository>(
  'DetailsRepository',
  DetailsRepository
);
container.registerSingleton<IImagesRepository>(
  'ImagesRepository',
  ImagesRepository
);
container.registerSingleton<IInstitutionsRepository>(
  'InstitutionsRepository',
  InstitutionsRepository
);
container.registerSingleton<IRelatoriesRepository>(
  'RelatoriesRepository',
  RelatoriesRepository
);
container.registerSingleton<IRelfavoritesRepository>(
  'RelfavoritesRepository',
  RelfavoritesRepository
);