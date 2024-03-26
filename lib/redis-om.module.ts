import { DynamicModule, Module } from '@nestjs/common';
import { RedisOmCoreModule } from './redis-om-core.module';
import {
  RedisOmModuleAsyncOptions,
  RedisOmModuleOptions,
} from './interfaces/options.interface';
import { DEFAULT_DATA_SOURCE_NAME } from './redis-om.constants';
import { createRedisOmEntityProviders } from './redis-om.providers';
import { EntityClass } from './interfaces/entity-class-or-schema.type';

@Module({})
export class RedisOmModule {
  static forRoot(options?: RedisOmModuleOptions): DynamicModule {
    return {
      module: RedisOmModule,
      imports: [RedisOmCoreModule.forRoot(options)],
    };
  }

  static forFeature(
    entities: EntityClass[] = [],
    dataSourceName: string = DEFAULT_DATA_SOURCE_NAME,
  ): DynamicModule {
    const providers = createRedisOmEntityProviders(entities, dataSourceName);

    return {
      module: RedisOmModule,
      providers: providers,
      exports: providers,
    };
  }

  static forRootAsync(options: RedisOmModuleAsyncOptions): DynamicModule {
    return {
      module: RedisOmModule,
      imports: [RedisOmCoreModule.forRootAsync(options)],
    };
  }
}
