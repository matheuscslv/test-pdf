import { inject, injectable, singleton } from 'tsyringe';

import Solicitation from '../../database/entities/Solicitation';
import { ISolicitationRepository } from '../../repositories/interfaces/ISolicitationRepository';
import { IUserRepository } from '../../repositories/interfaces/IUserRepository';
import { io } from '../../server';
import AppError from '../../utils/error';

interface ISolicitationUpdateDTO {
  request_fac?: string;
  request_busca_avancada?: string;
  request_busca_avancada_civil?: string;
  request_busca_avancada_criminal?: string;
  request_busca_avancada_inrc?: string;
  request_busca_avancada_prisional?: string;
  status?: string;
  observacao?: string;
  deleted_at?: string | undefined;
}

interface ISolicitationCreateDTO {
  request_fac?: string;
  request_busca_avancada?: string;
  request_busca_avancada_civil?: string;
  request_busca_avancada_criminal?: string;
  request_busca_avancada_inrc?: string;
  request_busca_avancada_prisional?: string;
}

interface ISolicitationReturnPagination {
  data: Solicitation[];
  count: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
  lastPage: number;
}

@singleton()
@injectable()
class SolicitationService {
  constructor(
    // @ts-ignore
    @inject('SolicitationRepository')
    private solicitationRepository: ISolicitationRepository,

    @inject('UserRepository') private userRepository: IUserRepository
  ) {}

  async index(
    status: string,
    institution_id: string,
    search: string,
    page: number,
    limit: number
  ): Promise<ISolicitationReturnPagination> {
    const solicitations = await this.solicitationRepository.all(
      status,
      institution_id,
      search,
      page,
      limit
    );

    return solicitations;
  }

  async show(
    id: string,
    status: string,
    search: string,
    page: number,
    limit: number
  ): Promise<ISolicitationReturnPagination> {
    const solicitations = await this.solicitationRepository.findOneByUserId(
      id,
      status,
      search,
      page,
      limit
    );

    return solicitations;
  }

  async create(data: ISolicitationCreateDTO): Promise<Solicitation> {
    const solicitation = await this.solicitationRepository.create({
      ...data,
      status: 'Aguardando',
      data_solicitacao: new Date().toISOString(),
    });

    io.emit('new-create-solicitation', solicitation);

    return solicitation;
  }

  async update(
    id: string,
    data: ISolicitationUpdateDTO
  ): Promise<Solicitation> {
    const isSolicitationExists = await this.solicitationRepository.findOneById(
      id
    );

    if (!isSolicitationExists) {
      throw new AppError('Solicitação não identificada!', 404);
    }

    if (isSolicitationExists.status !== 'Aguardando') {
      throw new AppError('Solicitação já respondida!', 401);
    }

    const solicitation = await this.solicitationRepository.update(id, {
      ...data,
      data_resposta_solicitacao:
        data.status === 'Aceito' || data.status === 'Negado'
          ? new Date().toISOString()
          : isSolicitationExists.data_resposta_solicitacao,
    });

    if (data.status === 'Aceito') {
      const user = await this.userRepository.findOneById(
        isSolicitationExists.user_solicitation_id
      );
      if (user) {
        await this.userRepository.update(user?.id, {
          busca_avancada: isSolicitationExists.request_busca_avancada,
          busca_avancada_inrc: isSolicitationExists.request_busca_avancada_inrc,
          emite_folha_antecedentes: isSolicitationExists.request_fac,
          busca_avancada_civil:
            isSolicitationExists.request_busca_avancada_civil,
          busca_avancada_criminal:
            isSolicitationExists.request_busca_avancada_criminal,
          busca_avancada_prisional:
            isSolicitationExists.request_busca_avancada_prisional,
        });
      }
    }

    io.emit('new-update-solicitation', solicitation);

    return solicitation;
  }
}

export { SolicitationService };
