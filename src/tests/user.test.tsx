import 'reflect-metadata';
import '../repositories';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import {
  createConnection,
  getConnectionOptions,
  Connection,
  getRepository,
  Repository,
} from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import Profile from '../database/entities/Profile';
import User from '../database/entities/User';
import { server } from '../server';

let conn: Connection;
let general_user: User;
let repository: Repository<User>;

describe('Teste de usuário', () => {
  beforeAll(async () => {
    const connOpts = await getConnectionOptions();
    conn = await createConnection({ ...connOpts });

    const newPass = await bcrypt.hash('86f90359326dc55580391beacf30bab7', 10);
    repository = getRepository(User);

    await repository.createQueryBuilder().delete().from(User).execute();

    const repositoryProfile = getRepository(Profile);
    const idProfile = uuidV4();
    const profile = repositoryProfile.create({
      id: idProfile,
      nome: 'Usuário Local',
      perfil_pesquisa: '',
      perfil_inrc: '',
    });
    await repositoryProfile.save(profile);

    const idProfileMaster = uuidV4();
    const profileMaster = repositoryProfile.create({
      id: idProfileMaster,
      nome: 'Administrador Master',
      perfil_pesquisa: '',
      perfil_inrc: '',
    });
    await repositoryProfile.save(profileMaster);

    const user = repository.create({
      id: uuidV4(),
      nome: 'Test',
      cpf: '22222222222',
      senha: newPass,
      email: 'example2@example.com',
      busca_avancada: 'F',
      profile_id: idProfileMaster,
    });

    await repository.save(user);

    general_user = repository.create({
      id: uuidV4(),
      nome: 'Test 2',
      cpf: '33333333333',
      senha: newPass,
      email: 'example3@example.com',
      busca_avancada: 'F',
      habilitado: 'T',
      is_created_gov: 'T',
      profile_id: idProfile,
    });

    await repository.save(general_user);

    process.env.NODE_ENV = 'test';
  });

  afterAll(async () => {
    await repository.createQueryBuilder().delete().from(User).execute();
    await conn.close();

    process.env.NODE_ENV = 'development';
  });

  afterEach(() => {
    server.close();
  });

  test('Listar usuários corretamente', (done) => {
    request(server)
      .post('/v1/login')
      .send({
        cpf: '22222222222',
        password: '86f90359326dc55580391beacf30bab7',
      })
      .then((response: any) => {
        request(server)
          .get(
            '/v1/users?page=1&limit=10&search=&institution_id=&profile_id=&habilitado=&isReturnAdm=true&isReturnGestor=true'
          )
          .set('Authorization', response.body.token)
          .then((response2: any) => {
            expect(response2.statusCode).toBe(200);
            expect(
              response2.body.data.some(({ cpf }: any) => cpf === '33333333333')
            ).toBe(true);
            done();
          });
      });
  });

  test('Retornar usuário autenticado corretamente', (done) => {
    request(server)
      .post('/v1/login')
      .send({
        cpf: '22222222222',
        password: '86f90359326dc55580391beacf30bab7',
      })
      .then((response: any) => {
        request(server)
          .get('/v1/users/userlogged')
          .set('Authorization', response.body.token)
          .then((response2: any) => {
            expect(response2.statusCode).toBe(200);
            expect(String(response2.body.id)).toBe(String(response.body.id));
            done();
          });
      });
  });

  test('Retornar reposta em usuário autenticado passando token incorreto', (done) => {
    process.env.NODE_ENV = 'development';
    request(server)
      .post('/v1/login')
      .send({
        cpf: '22222222222',
        password: '86f90359326dc55580391beacf30bab7',
      })
      .then((response: any) => {
        request(server)
          .get('/v1/users/userlogged')
          .set(
            'Authorization',
            jwt.sign({ cpf: '11111111111' }, process.env.API_KEY || '', {
              algorithm: 'HS256',
              allowInsecureKeySizes: true,
              expiresIn: 86400, // 24 hours
            })
          )
          .then((response2: any) => {
            expect(response2.statusCode).toBe(404);
            process.env.NODE_ENV = 'test';
            done();
          });
      });
  });

  test('Tentar atualizar usuário que não existe', (done) => {
    request(server)
      .post('/v1/login')
      .send({
        cpf: '22222222222',
        password: '86f90359326dc55580391beacf30bab7',
      })
      .then((response: any) => {
        request(server)
          .put(`/v1/users/${uuidV4()}`)
          .set('Authorization', response.body.token)
          .send({
            nome: 'Usuário Atualizado',
          })
          .then((response2: any) => {
            expect(response2.statusCode).toBe(404);
            done();
          });
      });
  });

  test('Atualizar usuário corretamente', (done) => {
    request(server)
      .post('/v1/login')
      .send({
        cpf: '22222222222',
        password: '86f90359326dc55580391beacf30bab7',
      })
      .then((response: any) => {
        request(server)
          .put(`/v1/users/${response.body.id}`)
          .set('Authorization', response.body.token)
          .send({
            busca_avancada: 'T',
          })
          .then((response2: any) => {
            expect(response2.statusCode).toBe(200);
            expect(response2.body.busca_avancada).toBe('T');
            done();
          });
      });
  });

  test('Remover usuário inexistente', (done) => {
    request(server)
      .post('/v1/login')
      .send({
        cpf: '22222222222',
        password: '86f90359326dc55580391beacf30bab7',
      })
      .then((response: any) => {
        request(server)
          .delete(`/v1/users/${uuidV4()}`)
          .set('Authorization', response.body.token)
          .then((response2: any) => {
            expect(response2.statusCode).toBe(404);
            done();
          });
      });
  });

  test('Remover usuário corretamente', (done) => {
    request(server)
      .post('/v1/login')
      .send({
        cpf: '22222222222',
        password: '86f90359326dc55580391beacf30bab7',
      })
      .then((response: any) => {
        request(server)
          .delete(`/v1/users/${general_user.id}`)
          .set('Authorization', response.body.token)
          .then((response2: any) => {
            expect(response2.statusCode).toBe(200);
            done();
          });
      });
  });
});
