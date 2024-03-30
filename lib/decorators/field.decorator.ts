import { FieldDefinition } from 'redis-om';
import { EntitiesMetadataStorage } from '../entities-metadata.storage';

export const Field = (options: FieldDefinition): PropertyDecorator => {
  return function (target: Function, propertyKey: string) {
    EntitiesMetadataStorage.addEntityFieldMetadata(
      target,
      propertyKey,
      options,
    );
  };
};
