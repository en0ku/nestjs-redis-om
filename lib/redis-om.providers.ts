import { Provider } from '@nestjs/common';
import { Entity, Repository, Schema, SchemaDefinition } from 'redis-om';
import {
  getDataSourceToken,
  getFieldMetadataToken,
  getRepositoryToken,
} from './utils/redis-om.utils';
import { RedisClient } from './interfaces/redis-client.type';
import { EntitiesMetadataStorage } from './entities-metadata.storage';
import { EntityClass } from './interfaces/entity-class-or-schema.type';

export function createRedisOmEntityProviders(
  entities?: EntityClass[],
  dataSourceName?: string,
): Provider[] {
  return (entities || []).map((entity) => ({
    provide: getRepositoryToken(entity, dataSourceName),
    useFactory: async (dataSource: RedisClient) => {
      const entityMetadata = EntitiesMetadataStorage.getEntitiesMetadata(
        entity.prototype,
      );
      const schema = new Schema(
        entityMetadata.schemaName,
        entityMetadata.fields,
        entityMetadata.schemaOptions,
      );
      const repository = new Repository(schema, dataSource);
      await repository.createIndex();
      return repository;
    },
    inject: [getDataSourceToken(dataSourceName)],
  }));
}
