import { Module } from '@nestjs/common';
import { RedisOmModule } from '../../lib';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    RedisOmModule.forRootAsync({
      useFactory: () => ({
        username: 'redis',
        password: 'rediS',
      }),
      name: 'CONNECTION_1',
    }),
    UserModule,
  ],
})
export class AppModule {}
