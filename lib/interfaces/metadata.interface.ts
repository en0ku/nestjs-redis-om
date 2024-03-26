import { FieldDefinition, SchemaOptions } from 'redis-om';

// export interface FieldMetadata {
//   schemaId: string;
//   options: FieldDefinition;
// }
export interface SchemaMetadata {
  schemaName: string;
  schemaOptions?: SchemaOptions;
  fields?: Record<string, FieldDefinition>;
}
