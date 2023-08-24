import 'reflect-metadata';
import '../repositories';
import request from 'supertest';
import { createConnection, getConnectionOptions, Connection } from 'typeorm';

import { server } from '../server';

let conn: Connection;

describe('Teste de Detalhes', () => {
  beforeAll(async () => {
    const connOpts = await getConnectionOptions('default');
    conn = await createConnection({ ...connOpts, name: 'default' });
  });

  afterAll(async () => {
    await conn.close();
  });

  afterEach(() => {
    server.close();
  });

  test('Detalhes com sucesso', (done) => {
    request(server)
      .post('/v1/details')
      .send({
        rg: '327490',
      })
      .then((response: any) => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });

  test('Texto vazio', (done) => {
    request(server)
      .post('/v1/details')
      .send({
        rg: '',
      })
      .then((response: any) => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });

  test('Texto pequeno', (done) => {
    request(server)
      .post('/v1/details')
      .send({
        rg: '32',
      })
      .then((response: any) => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
});
