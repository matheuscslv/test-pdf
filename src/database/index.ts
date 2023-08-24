import { Connection, createConnection, getConnectionOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import 'dotenv/config';

export default async (isSeed?: boolean): Promise<Connection> => {
  const data = await getConnectionOptions();

  const dbConnection = await createConnection({
    ...data,
    entities: isSeed ? ['./src/database/entities/*.ts'] : data.entities,
    namingStrategy: new SnakeNamingStrategy(),
  });

  if (!dbConnection.isConnected) await dbConnection.connect();
  return dbConnection;
};
