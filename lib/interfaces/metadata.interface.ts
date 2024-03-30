import { FieldDefinition, SchemaOptions } from 'redis-om';

export interface SchemaMetadata {
  schemaName: string;
  schemaOptions?: SchemaOptions;
  fields?: Record<string, FieldDefinition>;
}
