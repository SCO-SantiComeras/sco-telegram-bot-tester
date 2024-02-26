import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { SharedModule } from "../shared/shared.module";
import { TelegramBotResultsController } from "./telegram-bot-results.controller";
import { TelegramBotResultsService } from "./telegram-bot-results.service";
import { MongoDbService } from "../mongo-db/mongo-db.service";
import { ITelegramBotResult } from "./interface/itelegram-bot-result.interface";
import { telegramBotResultSchema } from "./schema/itelegram-bot-result.schema";
import { UsersModule } from "../users/users.module";

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }), 
        SharedModule,
        UsersModule,
    ],
    controllers: [TelegramBotResultsController],
    providers: [
        TelegramBotResultsService,
        {
            provide: 'MODEL',
            useFactory: (db: MongoDbService) =>
            db.getConnection().model<ITelegramBotResult>('TelegramBotResult', telegramBotResultSchema, 'telegram-bot-results'),
            inject: [MongoDbService],
        },
    ],
    exports: [TelegramBotResultsService],
})
export class TelegramBotResultsModule { }
