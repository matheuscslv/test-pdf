import Institution from '../entities/Institution';
import User from '../entities/User';
import createConnection from '../index';
import { v4 as uuidV4 } from 'uuid';

async function create() {
  const connection = await createConnection(true);
    
  const user = await connection
    .getRepository(User)
    .createQueryBuilder('user')
    .where('user.nome = :nome', { nome: 'MSB' })
    .getOne();

  const institution = await connection
    .createQueryBuilder()
    .insert()
    .into(Institution)
    .values({
      id: uuidV4(),
      nome: 'Instituicao 1',
      status: true,
      sigla: 'INSTI'
    })
    .returning('id')
    .execute();

  await connection
    .createQueryBuilder()
    .update(User)
    .set({ institution_id: institution?.raw[0].id })
    .where('id = :id', { id: user?.id })
    .execute();

  connection.close();
}

create().then(() => console.log('instituicao created'));
