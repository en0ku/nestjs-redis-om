import { FieldDefinition } from 'redis-om';
import { SchemaMetadata } from './interfaces';
import { EntityClass } from './interfaces/entity-class-or-schema.type';

const ENTITY_METADATA_KEY = 'REDIS_OM:ENTITY_METADATA';

export class EntitiesMetadataStorage {
  static addEntityMetadata(
    target: EntityClass,
    metadata: SchemaMetadata,
  ): void {
    const existingMetadata = this.getEntitiesMetadata(target) ?? { fields: {} };
    const updatedMetadata = {
      ...existingMetadata,
      ...metadata,
      fields: {
        ...existingMetadata.fields,
        ...metadata.fields,
      },
    };
    Reflect.defineMetadata(ENTITY_METADATA_KEY, updatedMetadata, target);
  }

  static addEntityFieldMetadata(
    target: EntityClass,
    field: string,
    metadata: FieldDefinition,
  ): void {
    const entityMetadata = this.getEntitiesMetadata(target) ?? { fields: {} };
    const updatedFields = {
      ...entityMetadata.fields,
      [field]: metadata,
    };
    Reflect.defineMetadata(
      ENTITY_METADATA_KEY,
      {
        ...entityMetadata,
        fields: updatedFields,
      },
      target,
    );
  }

  static getEntitiesMetadata(target: EntityClass): SchemaMetadata | undefined {
    return Reflect.getMetadata(ENTITY_METADATA_KEY, target);
  }
}
