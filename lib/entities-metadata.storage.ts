import { FieldDefinition } from 'redis-om';
import { SchemaMetadata } from './interfaces';
import { EntityClass } from './interfaces/entity-class-or-schema.type';

export class EntitiesMetadataStorage {
  private static readonly storage = new Map<EntityClass, SchemaMetadata>();

  static addEntityMetadata(
    target: EntityClass,
    metadata: SchemaMetadata,
  ): void {
    const entityMetadata = { ...this.getEntitiesMetadata(target) };
    this.storage.set(target, { ...entityMetadata, ...metadata });
  }
  static addEntityFieldMetadata(
    target: EntityClass,
    field: string,
    metadata: FieldDefinition,
  ): void {
    const entityMetadata = { ...this.getEntitiesMetadata(target) };
    if (typeof entityMetadata.fields !== 'object') {
      entityMetadata.fields = {};
    }
    entityMetadata.fields[field] = metadata;
    this.storage.set(target, entityMetadata);
  }

  static getEntitiesMetadata(target: EntityClass): SchemaMetadata {
    return this.storage.get(target);
  }
}
