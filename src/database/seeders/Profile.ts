import { v4 as uuidV4 } from 'uuid';

import Profile from '../entities/Profile';
import createConnection from '../index';

async function create() {
  const connection = await createConnection(true);

  await connection
    .createQueryBuilder()
    .insert()
    .into(Profile)
    .values({
      id: uuidV4(),
      nome: 'Administrador Master',
      perfil_pesquisa: '',
      perfil_inrc: '',
    })
    .execute();

  await connection
    .createQueryBuilder()
    .insert()
    .into(Profile)
    .values({
      id: uuidV4(),
      nome: 'Administrador',
      perfil_pesquisa: '',
      perfil_inrc: '',
    })
    .execute();

  await connection
    .createQueryBuilder()
    .insert()
    .into(Profile)
    .values({
      id: uuidV4(),
      nome: 'Gestor',
      perfil_pesquisa: '',
      perfil_inrc: '',
    })
    .execute();

  await connection
    .createQueryBuilder()
    .insert()
    .into(Profile)
    .values({
      id: uuidV4(),
      nome: 'Usuário Local',
      perfil_pesquisa: '',
      perfil_inrc: '',
    })
    .execute();

  connection.close();
}

create().then(() => console.log('profile created'));
