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

import Profile from '../database/entities/Profile';
import User from '../database/entities/User';
import { server } from '../server';

let conn: Connection;
let profile: Profile;
let repository: Repository<User>;
let repositoryProfile: Repository<Profile>;

describe('Teste de usuário', () => {
  beforeAll(async () => {
    const connOpts = await getConnectionOptions();
    conn = await createConnection({ ...connOpts });

    const newPass = await bcrypt.hash('86f90359326dc55580391beacf30bab7', 10);
    repository = getRepository(User);
    repositoryProfile = getRepository(Profile);

    await repository.createQueryBuilder().delete().from(User).execute();
    await repositoryProfile
      .createQueryBuilder()
      .delete()
      .from(Profile)
      .execute();

    const user = repository.create({
      id: uuidV4(),
      nome: 'Test',
      cpf: '22222222222',
      senha: newPass,
      email: 'example2@example.com',
      busca_avancada: 'F',
    });

    await repository.save(user);

    profile = repositoryProfile.create({
      id: uuidV4(),
      nome: 'Administrador',
      perfil_pesquisa: '',
      perfil_inrc: '',
    });

    await repositoryProfile.save(profile);
  });

  afterAll(async () => {
    await repository.createQueryBuilder().delete().from(User).execute();
    await repositoryProfile
      .createQueryBuilder()
      .delete()
      .from(Profile)
      .execute();
    await conn.close();
  });

  afterEach(() => {
    server.close();
  });

  test('Erro ao criar perfil com nome ja existente', (done) => {
    request(server)
      .post('/v1/profiles')
      .send({
        nome: 'Administrador',
        perfil_pesquisa: '',
        perfil_inrc: '',
      })
      .then((response: any) => {
        expect(response.statusCode).toBe(409);
        done();
      });
  });


  test('Listar perfis corretamente passando parametro para retornar administradores', (done) => {
    request(server)
      .post('/v1/login')
      .send({
        cpf: '22222222222',
        password: '86f90359326dc55580391beacf30bab7',
      })
      .then((response: any) => {
        request(server)
          .get('/v1/profiles?isReturnAdm=true')
          .set('Authorization', response.body.token)
          .then((response2: any) => {
            expect(response2.statusCode).toBe(200);
            expect(
              response2.body.some(({ nome }: any) => nome === 'Administrador')
            ).toBe(true);
            done();
          });
      });
  });

  test('Listar perfis corretamente passando parametro para não retornar administradores', (done) => {
    request(server)
      .post('/v1/login')
      .send({
        cpf: '22222222222',
        password: '86f90359326dc55580391beacf30bab7',
      })
      .then((response: any) => {
        request(server)
          .get('/v1/profiles')
          .set('Authorization', response.body.token)
          .then((response2: any) => {
            expect(response2.statusCode).toBe(200);
            expect(
              response2.body.some(({ nome }: any) => nome === 'Administrador')
            ).toBe(false);
            done();
          });
      });
  });
});
