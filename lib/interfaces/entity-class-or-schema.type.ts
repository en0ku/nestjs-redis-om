import {
  EntityData,
  EntityDataValue,
  EntityId,
  EntityKeyName,
  Entity as TEntity,
} from 'redis-om';

export class Entity implements TEntity {
  [key: string]:
    | EntityDataValue
    | EntityData
    | Array<EntityDataValue | EntityData>;
  [EntityId]?: string;
  [EntityKeyName]?: string;
}
export type EntityClass = Entity['constructor'];
