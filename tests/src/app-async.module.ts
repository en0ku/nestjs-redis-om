import { Module } from '@nestjs/common';
import { RedisOmModule } from '../../lib';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    RedisOmModule.forRootAsync({
      useFactory: () => ({
        url: 'redis://:password@127.0.0.1:6379',
        // name: 'CONNECTION_1',
      }),
      name: 'CONNECTION_1',
    }),
    UserModule,
  ],
})
export class AsyncAppModule {}
