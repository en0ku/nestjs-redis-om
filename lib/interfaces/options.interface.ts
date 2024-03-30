import { RedisClientOptions } from './redis-client.type';
import { ModuleMetadata, Provider, Type } from '@nestjs/common';

export type DataSourceOptions = RedisClientOptions;

export type RedisOmModuleOptions = DataSourceOptions & {};

export interface RedisOmOptionsFactory {
  createRedisOmOptions(
    connectionName?: string,
  ): Promise<RedisOmModuleOptions> | RedisOmModuleOptions;
}

export interface RedisOmModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  useExisting?: Type<RedisOmOptionsFactory>;
  useClass?: Type<RedisOmOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<RedisOmModuleOptions> | RedisOmModuleOptions;
  inject?: any[];
  extraProviders?: Provider[];
}
