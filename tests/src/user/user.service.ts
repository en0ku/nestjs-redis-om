import { Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '../../../lib';
import { Repository } from 'redis-om';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity, 'CONNECTION_1')
    private readonly userRepository: Repository,
  ) {}

  async create(data: UserEntity) {
    return this.userRepository.save(data);
  }
  async get(...ids: string[]) {
    return this.userRepository.fetch(...ids);
  }
  async getAll() {
    return this.userRepository.search().all();
  }
}
