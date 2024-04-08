import { Module } from '@nestjs/common';
import { RedisOmModule } from '../../../lib';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [RedisOmModule.forFeature([UserEntity], 'CONNECTION_1')],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
