import { registerAs } from '@nestjs/config';

export const configurationMongo = registerAs('mongo', () => ({
  host: process.env.HOST_MONGODB || 'localhost',
  port: parseInt(process.env.PORT_MONGODB, 10 || 27017),
  database: process.env.DATABASE_MONGODB,
  user: process.env.USER_MONGODB || '',
  password: process.env.PASSWORD_MONGODB || '',
}));
