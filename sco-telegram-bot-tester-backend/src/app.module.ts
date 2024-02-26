import { Module } from '@nestjs/common';
import { TelegramBotModule } from './modules/telegram-bot/telegram-bot.module';
import { LoggerModule } from './modules/logger/logger.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configurationApp } from './configuration/configuration-app';
import { configurationWebsocket } from './configuration/configuration-websocket';
import { WebsocketModule } from './modules/websocket/websocket.module';
import { WebsocketConfig } from './modules/websocket/config/websocket-config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        configurationApp,
        configurationWebsocket,
      ],
      envFilePath: `./env/${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    WebsocketModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const websocketConfig: WebsocketConfig = {
          port: configService.get('websocket.port'),
        };
        return websocketConfig;
      },
      inject: [ConfigService],
    }),
    LoggerModule,
    TelegramBotModule,
  ],
})
export class AppModule {}
