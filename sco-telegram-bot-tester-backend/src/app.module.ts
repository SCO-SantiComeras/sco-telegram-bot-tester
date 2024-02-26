import { Module } from '@nestjs/common';
import { TelegramBotModule } from './modules/telegram-bot/telegram-bot.module';
import { LoggerModule } from './modules/logger/logger.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configurationApp } from './configuration/configuration-app';
import { configurationWebsocket } from './configuration/configuration-websocket';
import { WebsocketModule } from './modules/websocket/websocket.module';
import { WebsocketConfig } from './modules/websocket/config/websocket-config';
import { configurationMongo } from './configuration/configuration-mongo';
import { MongoDbModule } from './modules/mongo-db/mongo-db.module';
import { MongoDbConfig } from './modules/mongo-db/mongo-db-config';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        configurationApp,
        configurationWebsocket,
        configurationMongo,
      ],
      envFilePath: `./env/${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    WebsocketModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const websocketConfig: WebsocketConfig = {
          port: configService.get('websocket.port'),
          origin: configService.get('websocket.origin'),
        };
        return websocketConfig;
      },
      inject: [ConfigService],
    }),
    MongoDbModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const mongoDB: MongoDbConfig = {
          ip: configService.get('mongo.host'),
          port: configService.get('mongo.port'),
          database: configService.get('mongo.database'),
          user: configService.get('mongo.user'),
          pass: configService.get('mongo.password'),
        };
        return mongoDB;
      },
      inject: [ConfigService],
    }),
    LoggerModule,
    UsersModule,
    TelegramBotModule,
  ],
})
export class AppModule {}
