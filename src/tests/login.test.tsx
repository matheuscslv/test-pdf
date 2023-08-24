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

import User from '../database/entities/User';
import { server } from '../server';

let conn: Connection;
let user: User;
let repository: Repository<User>;

describe('Teste de login', () => {
  beforeAll(async () => {
    const connOpts = await getConnectionOptions();
    conn = await createConnection({ ...connOpts });

    const newPass = await bcrypt.hash('86f90359326dc55580391beacf30bab7', 10);
    repository = getRepository(User);

    await repository.createQueryBuilder().delete().from(User).execute();

    user = repository.create({
      id: uuidV4(),
      nome: 'Test',
      cpf: '11111111111',
      senha: newPass,
      email: 'example@example.com',
      busca_avancada: 'F',
    });

    await repository.save(user);

    const user2 = repository.create({
      id: uuidV4(),
      nome: 'Test 2',
      cpf: '44444444444',
      senha: newPass,
      email: 'example2@example.com',
      busca_avancada: 'F',
      habilitado: 'F',
    });
    await repository.save(user2);
  });

  afterAll(async () => {
    await repository.createQueryBuilder().delete().from(User).execute();
    await conn.close();
  });

  afterEach(() => {
    server.close();
  });

  test('Login com usuário existente', (done) => {
    request(server)
      .post('/v1/login')
      .send({
        cpf: '11111111111',
        password: '86f90359326dc55580391beacf30bab7',
      })
      .then((response: any) => {
        user = response.body;
        expect(response.statusCode).toBe(200);
        done();
      });
  });

  test('Login com usuário existente e senha incorreta', (done) => {
    request(server)
      .post('/v1/login')
      .send({
        cpf: '11111111111',
        password: 'senha',
      })
      .then((response: any) => {
        expect(response.statusCode).toBe(401);
        done();
      });
  });

  test('Login com usuário inexistente e senha incorreta', (done) => {
    request(server)
      .post('/v1/login')
      .send({
        cpf: '77777777777',
        password: '86f90359326dc55580391beacf30bab7',
      })
      .then((response: any) => {
        expect(response.statusCode).toBe(401);
        done();
      });
  });

  test('Login com usuário que não está habilitado', (done) => {
    request(server)
      .post('/v1/login')
      .send({
        cpf: '44444444444',
        password: '86f90359326dc55580391beacf30bab7',
      })
      .then((response: any) => {
        expect(response.statusCode).toBe(401);
        done();
      });
  });

  test('Login com novo usuário', (done) => {
    request(server)
      .post('/v1/login')
      .send({
        nome: 'Test 2',
        cpf: '22222222222',
        contato: {
          email: 'example2@example.com',
        },
        access_token: jwt.sign(
          { cpf: '22222222222' },
          process.env.API_KEY || '',
          {
            algorithm: 'HS256',
            allowInsecureKeySizes: true,
            expiresIn: 86400, // 24 hours
          }
        ),
      })
      .then((response: any) => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });

  test('Logout de usuário com sucesso e token zerado', (done) => {
    request(server)
      .post('/v1/login/exit')
      .set('Authorization', user.token)
      .then(async (response: any) => {
        // @ts-ignore
        const aux = await repository.findOne({ where: { cpf: user.cpf } });
        expect(aux?.token).toBe(null);
        expect(response.statusCode).toBe(200);
        done();
      });
  });

  test('Logout com token não associado a usuário', (done) => {
    request(server)
      .post('/v1/login/exit')
      .set('Authorization', user.token)
      .then((response: any) => {
        expect(response.statusCode).toBe(404);
        done();
      });
  });
});
