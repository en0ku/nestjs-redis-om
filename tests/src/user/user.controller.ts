import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly romService: UserService) {}

  @Post()
  async createTestEntity(@Body() body: any) {
    return await this.romService.create(body);
  }

  @Get()
  async getAll() {
    return await this.romService.getAll();
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return await this.romService.get(id);
  }
}
