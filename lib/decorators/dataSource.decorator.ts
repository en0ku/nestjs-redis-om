import { Inject } from '@nestjs/common';
import { DataSourceOptions } from '../interfaces/options.interface';
import { getDataSourceToken } from '../utils/redis-om.utils';

export const InjectDataSource: (
  dataSource?: DataSourceOptions | string,
) => ReturnType<typeof Inject> = (dataSource?: DataSourceOptions | string) =>
  Inject(getDataSourceToken(dataSource));
