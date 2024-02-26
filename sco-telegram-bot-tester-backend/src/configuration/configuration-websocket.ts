import { registerAs } from '@nestjs/config';

export const configurationWebsocket = registerAs('websocket', () => ({
  port: parseInt(process.env.PORT_WEBSOCKET),
  origin: process.env.ORIGIN_WEBSOCKET,
}));
