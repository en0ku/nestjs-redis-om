import {
  DynamicModule,
  Global,
  Inject,
  Logger,
  Module,
  OnApplicationShutdown,
  OnModuleInit,
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
export class RedisOmCoreModule implements OnApplicationShutdown, OnModuleInit {
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
      useFactory: async () =>
        await RedisOmCoreModule.createDataSourceFactory(options),
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
      useFactory: async (
        dataSourceOptions: Omit<RedisOmModuleOptions, 'name'>,
      ) => {
        return await RedisOmCoreModule.createDataSourceFactory({
          ...dataSourceOptions,
          name: options.name,
        });
      },
      inject: [REDIS_OM_MODULE_OPTIONS],
    };
    const asyncProviders = RedisOmCoreModule.createAsyncProviders(options);
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
      return [RedisOmCoreModule.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass;
    return [
      RedisOmCoreModule.createAsyncOptionsProvider(options),
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
        useFactory: async (...args: any[]) => {
          const config = await options.useFactory(...args);
          return {
            ...config,
            name: options.name,
          };
        },
        inject: options.inject || [],
      };
    }
    const inject = [options.useClass || options.useExisting];
    return {
      provide: REDIS_OM_MODULE_OPTIONS,
      useFactory: async (optionsFactory: RedisOmOptionsFactory) => {
        const config = await optionsFactory.createRedisOmOptions(options.name);
        return {
          ...config,
          name: options.name,
        };
      },
      inject,
    };
  }

  async onModuleInit() {
    this.logger.log(`"${this.options.name}" connected.`);

    const dataSource = this.moduleRef.get<RedisClient>(
      getDataSourceToken(this.options),
    );
    dataSource.on('error', (err) => {
      this.logger.error(`Redis error (${this.options.name}): ${err.message}`);
    });
  }

  async onApplicationShutdown(): Promise<void> {
    const dataSource = this.moduleRef.get<RedisClient>(
      getDataSourceToken(this.options),
    );
    try {
      if (dataSource && dataSource.isOpen) {
        await dataSource.quit();
        this.logger.log('data source has disconnected');
      }
    } catch (e) {
      this.logger.error(e?.message);
    }
  }
}
