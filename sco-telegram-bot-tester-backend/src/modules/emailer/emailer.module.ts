import { DynamicModule, Module, ModuleMetadata, Provider, Type } from '@nestjs/common';
import { EmailerConfig } from './config/emailer-config';
import { EmailerService } from './emailer.service';
import { SharedModule } from '../shared/shared.module';

interface EmailerConfigFactory {
  createEmailerConfig(): Promise<EmailerConfig> | EmailerConfig;
}

export interface EmailerAsyncConfig
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useExisting?: Type<EmailerConfigFactory>;
  useClass?: Type<EmailerConfigFactory>;
  useFactory?: (...args: any[]) => Promise<EmailerConfig> | EmailerConfig;
}

@Module({
  imports: [SharedModule],
  providers: [EmailerService],
  exports: [EmailerService],
})
export class EmailerModule {
  static register(options: EmailerConfig): DynamicModule {
    return {
      module: EmailerModule,
      imports: [SharedModule],
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
        EmailerService,
      ],
      exports: [EmailerService],
      global: true,
    };
  }

  public static registerAsync(options: EmailerAsyncConfig): DynamicModule {
    return {
      module: EmailerModule,
      imports: [SharedModule],
      providers: [
        EmailerService,
        ...this.createConfigProviders(options),
      ],
      exports: [EmailerService],
      global: true
    };
  }

  private static createConfigProviders(options: EmailerAsyncConfig): Provider[] {
    if (options.useFactory) {
      return [
        {
          provide: 'CONFIG_OPTIONS',
          useFactory: options.useFactory,
          inject: options.inject || [],
        }
      ]
    }

    return [
      {
        provide: 'CONFIG_OPTIONS',
        useFactory: async (optionsFactory: EmailerConfigFactory) => 
          await optionsFactory.createEmailerConfig(),
        inject: [options.useExisting || options.useClass],
      }
    ];
  }
}