import { DynamicModule, Module, ModuleMetadata, Type } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthConfig } from './config/auth.config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthStrategy } from './strategies/auth.strategy';
import { SharedModule } from '../shared/shared.module';

interface AuthConfigFactory {
  createMongoConfig(): Promise<AuthConfig> | AuthConfig;
}

export interface AuthAsyncConfig extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useExisting?: Type<AuthConfigFactory>;
  useClass?: Type<AuthConfigFactory>;
  useFactory?: (...args: any[]) => Promise<AuthConfig> | AuthConfig;
}

@Module({})
export class AuthModule {
  static register(options: AuthConfig): DynamicModule {
    return {
      module: AuthModule,
      controllers: [AuthController],
      providers: [AuthService, AuthStrategy],
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: options.secret,
          signOptions: options.signOptions,
        }),
        SharedModule,
        UsersModule,
      ],
      exports: [AuthService],
      global: true,
    };
  }

  public static registerAsync(options: AuthAsyncConfig): DynamicModule {
    return {
      module: AuthModule,
      controllers: [AuthController],
      providers: [AuthService, AuthStrategy],
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
          useFactory: options.useFactory,
          inject: options.inject || [],
        }),
        SharedModule,
        UsersModule,
      ],
      exports: [AuthService],
      global: true,
    };
  }
}
