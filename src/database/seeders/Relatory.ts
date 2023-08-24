import Relatory from '../entities/Relatory';
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

  await connection
    .createQueryBuilder()
    .insert()
    .into(Relatory)
    .values({
      id: uuidV4(),
      nome: 'Relatorio 1',
      campos: 'nome,cpf,rg',
      user_id: user?.id,
      institution_id: user?.institution_id,
      deleted: false,
    })
    .execute();

  connection.close();
}

create().then(() => console.log('relatory created'));
