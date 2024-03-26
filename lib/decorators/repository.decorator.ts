import { Inject } from '@nestjs/common';
import { EntityClass } from '../interfaces/entity-class-or-schema.type';
import { DEFAULT_DATA_SOURCE_NAME } from '../redis-om.constants';
import { getRepositoryToken } from '../utils/redis-om.utils';

export const InjectRepository = (
  entity: EntityClass,
  dataSourceName: string = DEFAULT_DATA_SOURCE_NAME,
): ReturnType<typeof Inject> =>
  Inject(getRepositoryToken(entity, dataSourceName));
