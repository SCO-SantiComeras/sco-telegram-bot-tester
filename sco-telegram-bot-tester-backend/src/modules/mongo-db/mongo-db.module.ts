import { DynamicModule, Module, ModuleMetadata, Provider, Type } from '@nestjs/common';
import { MongoDbConfig } from './mongo-db-config';
import { MongoDbService } from './mongo-db.service';

interface MongoConfigFactory {
  createMongoConfig(): Promise<MongoDbConfig> | MongoDbConfig;
}

export interface MongoAsyncConfig extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useExisting?: Type<MongoConfigFactory>;
  useClass?: Type<MongoConfigFactory>;
  useFactory?: (...args: any[]) => Promise<MongoDbConfig> | MongoDbConfig;
}

@Module({
  controllers: [],
  providers: [MongoDbService],
  exports: [MongoDbService],
})
export class MongoDbModule {
  static register(options: MongoDbConfig): DynamicModule {
    return {
      module: MongoDbModule,
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
        MongoDbService,
      ],
      exports: [MongoDbService],
      global: true,
    };
  }

  public static registerAsync(options: MongoAsyncConfig): DynamicModule {
    return {
      module: MongoDbModule,
      providers: [MongoDbService, ...this.createConnectProviders(options)],
      exports: [MongoDbService],
      global: true,
    };
  }

  private static createConnectProviders(options: MongoAsyncConfig): Provider[] {
    if (options.useFactory) {
      return [
        {
          provide: 'CONFIG_OPTIONS',
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
      ];
    }

    return [
      {
        provide: 'CONFIG_OPTIONS',
        useFactory: async (optionsFactory: MongoConfigFactory) =>
          await optionsFactory.createMongoConfig(),
        inject: [options.useExisting || options.useClass],
      },
    ];
  }
}
