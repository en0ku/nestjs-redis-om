import {
  DEFAULT_DATA_SOURCE_NAME,
  FIELD_METADATA,
} from '../redis-om.constants';
import { EntityClass } from '../interfaces/entity-class-or-schema.type';
import { DataSourceOptions } from '../interfaces/options.interface';
import { v4 as uuidv4 } from 'uuid';

export function getSchemaMetadataToken(schemaName: string) {
  return joinStrings(FIELD_METADATA, schemaName);
}
export function getFieldMetadataToken(fieldName: string, schemaName: string) {
  return joinStrings(FIELD_METADATA, fieldName, schemaName);
}
export function getDataSourceToken(
  dataSourceOptionsOrName: DataSourceOptions | string,
) {
  return joinStrings(
    (typeof dataSourceOptionsOrName === 'string'
      ? dataSourceOptionsOrName
      : dataSourceOptionsOrName?.name) ?? DEFAULT_DATA_SOURCE_NAME,
    'data_source',
  );
}
export function getRepositoryToken(
  entity: EntityClass,
  dataSourceName: string,
) {
  return joinStrings(
    getDataSourceToken(dataSourceName),
    entity.prototype.constructor.name,
    'repository',
  );
}

const SEPARATOR = '_';
function joinStrings(...strings: string[]): string {
  return strings.join(SEPARATOR);
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}
export function isSymbol(value: unknown): value is symbol {
  return typeof value === 'symbol';
}

export const generateString = (): string => uuidv4();
