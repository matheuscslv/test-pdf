import 'reflect-metadata';
import '../repositories';

import bcrypt from 'bcryptjs';
import request from 'supertest';
import {
  createConnection,
  getConnectionOptions,
  Connection,
  getRepository,
  Repository,
} from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import Institution from '../database/entities/Institution';
import Profile from '../database/entities/Profile';
import Solicitation from '../database/entities/Solicitation';
import User from '../database/entities/User';
import { server } from '../server';

let conn: Connection;
let repository: Repository<User>;
let repositorySolicitation: Repository<Solicitation>;
let repositoryInstitution: Repository<Institution>;
let repositoryProfile: Repository<Profile>;
let solicitation: Solicitation;

describe('Teste de usuário', () => {
  beforeAll(async () => {
    const connOpts = await getConnectionOptions();
    conn = await createConnection({ ...connOpts });

    const newPass = await bcrypt.hash('86f90359326dc55580391beacf30bab7', 10);
    repository = getRepository(User);
    repositorySolicitation = getRepository(Solicitation);
    repositoryInstitution = getRepository(Institution);
    repositoryProfile = getRepository(Profile);

    await repositorySolicitation
      .createQueryBuilder()
      .delete()
      .from(Solicitation)
      .execute();
    await repositoryProfile
      .createQueryBuilder()
      .delete()
      .from(Profile)
      .execute();
    await repository.createQueryBuilder().delete().from(User).execute();
    await repositoryInstitution
      .createQueryBuilder()
      .delete()
      .from(Institution)
      .execute();

    const userUsuario = repository.create({
      id: uuidV4(),
      nome: 'Usuário',
      cpf: '22222222222',
      senha: newPass,
      email: 'example2@example.com',
      busca_avancada: 'F',
    });

    await repository.save(userUsuario);

    const userGestor = repository.create({
      id: uuidV4(),
      nome: 'Gestor',
      cpf: '33333333333',
      senha: newPass,
      email: 'example3@example.com',
      busca_avancada: 'T',
    });

    await repository.save(userGestor);

    const profileUsuario = repositoryProfile.create({
      id: uuidV4(),
      nome: 'Usuário Local',
      perfil_pesquisa: '',
      perfil_inrc: '',
    });

    await repositoryProfile.save(profileUsuario);

    const profileGestor = repositoryProfile.create({
      id: uuidV4(),
      nome: 'Gestor',
      perfil_pesquisa: '',
      perfil_inrc: '',
    });

    await repositoryProfile.save(profileGestor);

    const institution = repositoryInstitution.create({
      nome: 'SISID',
      status: true,
    });

    await repositoryInstitution.save(institution);

    await repository.update(
      { id: userUsuario.id },
      {
        profile_id: profileUsuario.id,
        institution_id: institution.id,
      }
    );

    await repository.update(
      { id: userGestor.id },
      {
        profile_id: profileGestor.id,
        institution_id: institution.id,
      }
    );

    solicitation = repositorySolicitation.create({
      request_busca_avancada: 'T',
      request_busca_avancada_civil: 'Avancado',
      request_busca_avancada_criminal: 'Avancado',
      request_busca_avancada_inrc: 'Avancado',
      request_busca_avancada_prisional: 'Avancado',
      request_fac: 'T',
      status: 'Aguardando',
      user_solicitation_id: userUsuario.id,
      data_solicitacao: new Date().toISOString(),
    });

    await repositorySolicitation.save(solicitation);
  });

  afterAll(async () => {
    await repositorySolicitation
      .createQueryBuilder()
      .delete()
      .from(Solicitation)
      .execute();
    await repositoryProfile
      .createQueryBuilder()
      .delete()
      .from(Profile)
      .execute();
    await repository.createQueryBuilder().delete().from(User).execute();
    await repositoryInstitution
      .createQueryBuilder()
      .delete()
      .from(Institution)
      .execute();
    await conn.close();
  });

  afterEach(() => {
    server.close();
  });

  test('Listar todas as solicitações pertencentes ao usuário', (done) => {
    request(server)
      .post('/v1/login')
      .send({
        cpf: '22222222222',
        password: '86f90359326dc55580391beacf30bab7',
      })
      .then((response: any) => {
        request(server)
          .get(`/v1/solicitations/${response.body.id}`)
          .set('Authorization', response.body.token)
          .then((response2: any) => {
            expect(response2.statusCode).toBe(200);
            expect(
              response2.body.data.some(
                ({ user_solicitation_id }: any) =>
                  user_solicitation_id === response.body.id
              )
            ).toBe(true);
            done();
          });
      });
  });

  test('Listar todas as solicitações pertencentes ao gestor', (done) => {
    request(server)
      .post('/v1/login')
      .send({
        cpf: '33333333333',
        password: '86f90359326dc55580391beacf30bab7',
      })
      .then((response: any) => {
        request(server)
          .get(
            `/v1/solicitations?institution_id=${response.body.institution_id}`
          )
          .set('Authorization', response.body.token)
          .then((response2: any) => {
            expect(response2.statusCode).toBe(200);
            expect(
              response2.body.data.some(
                ({ usuario_solicitacao }: any) =>
                  usuario_solicitacao.institution_id ===
                  response.body.institution_id
              )
            ).toBe(true);
            done();
          });
      });
  });

  test('Atualizar solicitação dando aceite e alterar permissão do usuário', (done) => {
    request(server)
      .post('/v1/login')
      .send({
        cpf: '33333333333',
        password: '86f90359326dc55580391beacf30bab7',
      })
      .then((response: any) => {
        request(server)
          .put(`/v1/solicitations/${solicitation.id}`)
          .send({
            status: 'Aceito',
          })
          .set('Authorization', response.body.token)
          .then((response2: any) => {
            expect(response2.statusCode).toBe(200);
            request(server)
              .post('/v1/login')
              .send({
                cpf: '22222222222',
                password: '86f90359326dc55580391beacf30bab7',
              })
              .then((response3: any) => {
                expect(response3.body.busca_avancada).toBe('T');
                done();
              });
          });
      });
  });
});
