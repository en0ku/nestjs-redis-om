import { Module } from '@nestjs/common';
import { RedisOmModule } from '../../lib';
import { UserModule } from './user/user.module';
import { CONNECTION_NAME } from './app.constants';

@Module({
  imports: [
    RedisOmModule.forRootAsync({
      useFactory: () => ({
        password: 'password',
      }),
      name: CONNECTION_NAME,
    }),
    UserModule,
  ],
})
export class AppModule {}
