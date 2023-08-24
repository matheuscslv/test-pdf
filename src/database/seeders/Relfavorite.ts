import Relatory from '../entities/Relatory';
import User from '../entities/User';
import Relfavorite from '../entities/Relfavorite';
import createConnection from '../index';
import { v4 as uuidV4 } from 'uuid';

async function create() {
  const connection = await createConnection(true);
    
  const user = await connection
    .getRepository(User)
    .createQueryBuilder('user')
    .where('user.nome = :nome', { nome: 'MSB' })
    .getOne();

  const relatory = await connection
    .getRepository(Relatory)
    .createQueryBuilder('relatory')
    .where('relatory.nome = :nome', { nome: 'Relatorio 1' })
    .getOne();


  await connection
    .createQueryBuilder()
    .insert()
    .into(Relfavorite)
    .values({
      id: uuidV4(),
      relatory_id: relatory?.id,
      user_id: user?.id,
    })
    .execute();

  connection.close();
}

create().then(() => console.log('Relfavorite created'));
