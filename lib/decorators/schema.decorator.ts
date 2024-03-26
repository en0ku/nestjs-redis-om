import { SchemaOptions } from 'redis-om';
import { EntitiesMetadataStorage } from '../entities-metadata.storage';

export const Schema = (
  schemaName: string,
  options?: SchemaOptions,
): ClassDecorator => {
  return function (target) {
    EntitiesMetadataStorage.addEntityMetadata(target.prototype, {
      schemaName,
      schemaOptions: options,
    });
  };
};
