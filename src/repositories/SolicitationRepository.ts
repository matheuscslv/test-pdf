import { getRepository, Repository, ILike, IsNull } from 'typeorm';

import Solicitation from '../database/entities/Solicitation';
import { ISolicitationRepository } from './interfaces/ISolicitationRepository';

interface IUpdateSolicitationDTO {
  request_fac?: string;
  request_busca_avancada?: string;
  request_busca_avancada_civil?: string;
  request_busca_avancada_criminal?: string;
  request_busca_avancada_inrc?: string;
  request_busca_avancada_prisional?: string;
  status?: string;
  data_resposta_solicitacao?: string;
  observacao?: string;
  deleted_at?: string | undefined;
}

interface ICreateSolicitationDTO {
  request_fac?: string;
  request_busca_avancada?: string;
  request_busca_avancada_civil?: string;
  request_busca_avancada_criminal?: string;
  request_busca_avancada_inrc?: string;
  request_busca_avancada_prisional?: string;
  status?: string;
  data_solicitacao?: string;
}

interface ISolicitationReturnPagination {
  data: Solicitation[];
  count: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
  lastPage: number;
}

class SolicitationRepository implements ISolicitationRepository {
  private repository: Repository<Solicitation>;
  constructor() {
    this.repository = getRepository(Solicitation);
  }

  async all(
    status: string,
    institution_id: string,
    search: string,
    page: number,
    limit: number
  ): Promise<ISolicitationReturnPagination> {
    const take = limit;
    const skip = (page - 1) * take;

    const [solicitations, total] = await this.repository.findAndCount({
      select: [
        'id',
        'request_busca_avancada',
        'request_busca_avancada_civil',
        'request_busca_avancada_criminal',
        'request_busca_avancada_inrc',
        'request_busca_avancada_prisional',
        'request_fac',
        'status',
        'data_solicitacao',
        'data_resposta_solicitacao',
        'user_solicitation_id',
        'user_response_solicitation_id',
        'observacao',
      ],
      where: {
        deleted_at: IsNull(),
        ...(status !== 'undefined' &&
          status !== '' && {
            status,
          }),
        usuario_solicitacao: {
          nome: ILike(`%${search}%`),
          ...(institution_id !== 'undefined' &&
            institution_id !== '' && {
              institution_id,
            }),
        },
      },
      relations: [
        'usuario_solicitacao',
        'usuario_solicitacao.instituicao',
        'usuario_resposta_solicitacao',
      ],
      order: { data_solicitacao: 'DESC' },
      take,
      skip,
    });

    const lastPage = Math.ceil(total / limit);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;

    return {
      data: solicitations,
      count: total,
      currentPage: page,
      nextPage,
      prevPage,
      lastPage,
    };
  }

  async create(data: ICreateSolicitationDTO): Promise<Solicitation> {
    const aux = this.repository.create(data);
    await this.repository.save(aux);

    const solicitation = await this.repository.findOne({
      select: [
        'id',
        'request_busca_avancada',
        'request_busca_avancada_civil',
        'request_busca_avancada_criminal',
        'request_busca_avancada_inrc',
        'request_busca_avancada_prisional',
        'request_fac',
        'status',
        'data_solicitacao',
        'data_resposta_solicitacao',
        'user_solicitation_id',
        'user_response_solicitation_id',
        'observacao',
      ],
      where: {
        deleted_at: IsNull(),
        id: aux.id,
      },
      relations: [
        'usuario_solicitacao',
        'usuario_solicitacao.instituicao',
        'usuario_resposta_solicitacao',
      ],
    });

    return solicitation as Solicitation;
  }

  async update(
    id: string,
    data: IUpdateSolicitationDTO
  ): Promise<Solicitation> {
    await this.repository.update({ id }, data);

    const solicitation = await this.repository.findOne({
      select: [
        'id',
        'request_busca_avancada',
        'request_busca_avancada_civil',
        'request_busca_avancada_criminal',
        'request_busca_avancada_inrc',
        'request_busca_avancada_prisional',
        'request_fac',
        'status',
        'data_solicitacao',
        'data_resposta_solicitacao',
        'user_solicitation_id',
        'user_response_solicitation_id',
        'observacao',
      ],
      where: {
        deleted_at: IsNull(),
        id,
      },
      relations: [
        'usuario_solicitacao',
        'usuario_solicitacao.instituicao',
        'usuario_resposta_solicitacao',
      ],
    });

    return solicitation as Solicitation;
  }

  async findOneById(id: string): Promise<Solicitation | undefined> {
    const solicitation = await this.repository.findOne({
      select: [
        'id',
        'request_busca_avancada',
        'request_busca_avancada_civil',
        'request_busca_avancada_criminal',
        'request_busca_avancada_inrc',
        'request_busca_avancada_prisional',
        'request_fac',
        'status',
        'data_solicitacao',
        'data_resposta_solicitacao',
        'user_solicitation_id',
        'user_response_solicitation_id',
        'observacao',
      ],
      where: {
        deleted_at: IsNull(),
        id,
      },
      relations: [
        'usuario_solicitacao',
        'usuario_solicitacao.instituicao',
        'usuario_resposta_solicitacao',
      ],
    });

    return solicitation;
  }

  async findOneByUserId(
    id: string,
    status: string,
    search: string,
    page: number,
    limit: number
  ): Promise<ISolicitationReturnPagination> {
    const take = limit;
    const skip = (page - 1) * take;

    const [solicitations, total] = await this.repository.findAndCount({
      select: [
        'id',
        'request_busca_avancada',
        'request_busca_avancada_civil',
        'request_busca_avancada_criminal',
        'request_busca_avancada_inrc',
        'request_busca_avancada_prisional',
        'request_fac',
        'status',
        'data_solicitacao',
        'data_resposta_solicitacao',
        'user_solicitation_id',
        'user_response_solicitation_id',
        'observacao',
      ],
      where: {
        deleted_at: IsNull(),
        ...(status !== 'undefined' &&
          status !== '' && {
            status,
          }),
        usuario_solicitacao: {
          id,
          nome: ILike(`%${search}%`),
        },
      },
      relations: [
        'usuario_solicitacao',
        'usuario_solicitacao.instituicao',
        'usuario_resposta_solicitacao',
      ],
      order: { data_solicitacao: 'DESC' },
      take,
      skip,
    });

    const lastPage = Math.ceil(total / limit);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;

    return {
      data: solicitations,
      count: total,
      currentPage: page,
      nextPage,
      prevPage,
      lastPage,
    };
  }
}

export { SolicitationRepository };
