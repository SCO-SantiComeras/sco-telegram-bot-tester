import { Module } from '@nestjs/common';
import { TelegramBotService } from './telegram-bot.service';
import { TelegramBotController } from './telegram-bot.controller';
import { TelegramBotResultsModule } from '../telegram-bot-results/telegram-bot-results.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    TelegramBotResultsModule,
  ],
  controllers: [
    TelegramBotController,
  ],
  providers: [
    TelegramBotService
  ],
  exports: [
    TelegramBotService
  ],
})
export class TelegramBotModule {

}