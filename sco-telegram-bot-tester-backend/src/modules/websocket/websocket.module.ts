import { DynamicModule, Module, ModuleMetadata, Provider, Type } from "@nestjs/common";
import { WebsocketConfig } from "./config/websocket-config";
import { WebsocketGateway } from "./websocket.gateway";

interface WebsocketConfigFactory {
  createWebsocketConfig(): Promise<WebsocketConfig> | WebsocketConfig;
}

export interface WebsocketAsyncConfig extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useExisting?: Type<WebsocketConfigFactory>;
  useClass?: Type<WebsocketConfigFactory>;
  useFactory?: (...args: any[]) => Promise<WebsocketConfig> | WebsocketConfig;
}

@Module({
  controllers: [],
  providers: [WebsocketGateway],
  exports: [WebsocketGateway],
})
export class WebsocketModule {
  static register(options: WebsocketConfig): DynamicModule {
    return {
      module: WebsocketModule,
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
        WebsocketGateway,
      ],
      exports: [WebsocketGateway],
      global: true,
    };
  }

  public static registerAsync(options: WebsocketAsyncConfig): DynamicModule {
    return {
      module: WebsocketModule,
      providers: [WebsocketGateway, ...this.createConnectProviders(options)],
      exports: [WebsocketGateway],
      global: true,
    };
  }

  private static createConnectProviders(options: WebsocketAsyncConfig): Provider[] {
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
        useFactory: async (optionsFactory: WebsocketConfigFactory) =>
          await optionsFactory.createWebsocketConfig(),
        inject: [options.useExisting || options.useClass],
      },
    ];
  }
}
