import 'reflect-metadata';
import '../repositories';
import request from 'supertest';
import { createConnection, getConnectionOptions, Connection } from 'typeorm';

import { server } from '../server';

let conn: Connection;

describe('Teste de Instituições', () => {
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

  test('Lista com sucesso', (done) => {
    request(server)
      .get('/v1/institutions')
      .then((response: any) => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});
