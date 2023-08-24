import bcrypt from 'bcryptjs';
import { v4 as uuidV4 } from 'uuid';

import User from '../entities/User';
import createConnection from '../index';

async function create() {
  const connection = await createConnection(true);

  const saltRounds = 10;
  const password = '86f90359326dc55580391beacf30bab7';
  const newPass = await bcrypt.hash(password, saltRounds);

  await connection
    .createQueryBuilder()
    .insert()
    .into(User)
    .values({
      id: uuidV4(),
      nome: 'MSB',
      cpf: '11111111111',
      senha: newPass,
      email: '',
      emite_folha_antecedentes: 'T',
      busca_avancada: 'T',
      busca_avancada_civil: 'Avancado',
      busca_avancada_criminal: 'Avancado',
      busca_avancada_inrc: 'Avancado',
      busca_avancada_prisional: 'Avancado',
    })
    .execute();

  connection.close();
}

create().then(() => console.log('user created'));
