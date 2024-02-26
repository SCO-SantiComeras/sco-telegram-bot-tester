import { registerAs } from '@nestjs/config';

export const configurationAuth = registerAs('auth', () => ({
  secret: process.env.SECRET_AUTH,
  expiresIn: process.env.EXPIRES_IN_AUTH,
  algorithm: process.env.ALGORITHM_AUTH,
}));
