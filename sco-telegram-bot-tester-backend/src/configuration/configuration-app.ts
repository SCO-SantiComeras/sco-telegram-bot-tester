import { registerAs } from '@nestjs/config';

export const configurationApp = registerAs('app', () => ({
  env: process.env.ENV_APP,
  port: parseInt(process.env.PORT_APP, 10 || 3000),
  host: process.env.HOST_APP,
  production: process.env.PRODUCTION_APP == 'true',
}));
