import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  autoLoadEntities: process.env.DB_LOAD_ENTITIES,
  synchronize: process.env.DB_SYNCHRONIZE,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  url: process.env.DB_URL,
}));
