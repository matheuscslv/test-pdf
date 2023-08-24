import Profile from '../entities/Profile';
import User from '../entities/User';
import createConnection from '../index';

async function create() {
  const connection = await createConnection(true);

  const profile = await connection
    .getRepository(Profile)
    .createQueryBuilder('profile')
    .where('profile.nome = :nome', { nome: 'Administrador Master' })
    .getOne();

  const user = await connection
    .getRepository(User)
    .createQueryBuilder('user')
    .where('user.nome = :nome', { nome: 'MSB' })
    .getOne();

  await connection
    .createQueryBuilder()
    .update(User)
    .set({ profile_id: profile?.id })
    .where('id = :id', { id: user?.id })
    .execute();

  connection.close();
}

create().then(() => console.log('user-profile created'));
