import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MongoDbService } from '../mongo-db/mongo-db.service';
import { SharedModule } from '../shared/shared.module';
import { IUser } from './interface/iuser.interface';
import { userSchema } from './schema/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }), 
    SharedModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'MODEL',
      useFactory: (db: MongoDbService) =>
        db.getConnection().model<IUser>('User', userSchema, 'users'),
      inject: [MongoDbService],
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
