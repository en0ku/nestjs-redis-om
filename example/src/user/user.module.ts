import { Module } from '@nestjs/common';
import { RedisOmModule } from '../../../lib';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CONNECTION_NAME } from '../app.constants';

@Module({
  imports: [RedisOmModule.forFeature([UserEntity], CONNECTION_NAME)],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
