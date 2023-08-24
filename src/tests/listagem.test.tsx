import 'reflect-metadata';
import '../repositories';
import request from 'supertest';
import { createConnection, getConnectionOptions, Connection } from 'typeorm';

import { server } from '../server';

let conn: Connection;

describe('Teste de Listagem', () => {
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
      .post('/v1/search')
      .send({
        texto: '30249465191',
        dt_ocorrencia: '',
        dt_nascimento: '',
        pagina_atual: 0,
        quantidade_por_pagina: 10,
      })
      .then((response: any) => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });

  test('Texto vazio', (done) => {
    request(server)
      .post('/v1/search')
      .send({
        texto: '',
        dt_ocorrencia: '',
        dt_nascimento: '',
        pagina_atual: 0,
        quantidade_por_pagina: 10,
      })
      .then((response: any) => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });

  test('Texto pequeno', (done) => {
    request(server)
      .post('/v1/search')
      .send({
        texto: '12',
        dt_ocorrencia: '',
        dt_nascimento: '',
        pagina_atual: 0,
        quantidade_por_pagina: 10,
      })
      .then((response: any) => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
});
