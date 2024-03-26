import {
  DynamicModule,
  Global,
  Inject,
  Logger,
  Module,
  OnApplicationShutdown,
  Provider,
} from '@nestjs/common';
import * as redis from 'redis';
import {
  REDIS_OM_MODULE_ID,
  REDIS_OM_MODULE_OPTIONS,
} from './redis-om.constants';
import {
  RedisOmModuleAsyncOptions,
  RedisOmModuleOptions,
  RedisOmOptionsFactory,
} from './interfaces/options.interface';
import { ModuleRef } from '@nestjs/core';
import { generateString, getDataSourceToken } from './utils/redis-om.utils';
import {
  RedisClient,
  RedisClientOptions,
} from './interfaces/redis-client.type';

@Global()
@Module({})
export class RedisOmCoreModule implements OnApplicationShutdown {
  private readonly logger = new Logger('RedisOmModule');

  constructor(
    @Inject(REDIS_OM_MODULE_OPTIONS)
    private readonly options: RedisOmModuleOptions,
    private readonly moduleRef: ModuleRef,
  ) {}

  static forRoot(options: RedisOmModuleOptions = {}): DynamicModule {
    const redisOmModuleOptions = {
      provide: REDIS_OM_MODULE_OPTIONS,
      useValue: options,
    };
    const dataSourceProvider = {
      provide: getDataSourceToken(options),
      useFactory: async () => await this.createDataSourceFactory(options),
    };

    const providers = [dataSourceProvider, redisOmModuleOptions];
    const exports = [dataSourceProvider];

    return {
      module: RedisOmCoreModule,
      providers,
      exports,
    };
  }

  static forRootAsync(options: RedisOmModuleAsyncOptions): DynamicModule {
    const dataSourceProvider = {
      provide: getDataSourceToken(options.name),
      useFactory: async (dataSourceOptions: RedisOmModuleOptions) => {
        return await this.createDataSourceFactory(dataSourceOptions);
      },
      inject: [REDIS_OM_MODULE_OPTIONS],
    };
    const asyncProviders = this.createAsyncProviders(options);
    const providers = [
      ...asyncProviders,
      dataSourceProvider,
      {
        provide: REDIS_OM_MODULE_ID,
        useValue: generateString(),
      },
      ...(options.extraProviders || []),
    ];
    const exports: Array<Provider | Function> = [dataSourceProvider];

    return {
      module: RedisOmCoreModule,
      imports: options.imports,
      providers,
      exports,
    };
  }

  static async createDataSourceFactory(options: RedisClientOptions) {
    const client = redis.createClient(options);
    await client.connect();
    return client;
  }

  private static createAsyncProviders(
    options: RedisOmModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: RedisOmModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: REDIS_OM_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    const inject = [options.useClass || options.useExisting];
    return {
      provide: REDIS_OM_MODULE_OPTIONS,
      useFactory: async (optionsFactory: RedisOmOptionsFactory) =>
        await optionsFactory.createRedisOmOptions(options.name),
      inject,
    };
  }

  async onApplicationShutdown(): Promise<void> {
    const dataSource = this.moduleRef.get<RedisClient>(
      getDataSourceToken(this.options),
    );
    try {
      if (dataSource && dataSource.isOpen) {
        await dataSource.disconnect();
        this.logger.log('data source has disconnected');
      }
    } catch (e) {
      this.logger.error(e?.message);
    }
  }
}
