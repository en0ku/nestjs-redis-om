import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { Server } from 'http';
import { AsyncAppModule } from '../src/app-async.module';

const body = {
  id: 1,
  username: 'username',
  registrationDate: new Date().toString(),
  isActive: true,
};
describe('RedisOm (sync configuration)', () => {
  let server: Server;
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AsyncAppModule],
    }).compile();

    app = module.createNestApplication();
    server = app.getHttpServer();
    await app.init();
  });

  it(`should return created entity`, () => {
    return request(server).post('/user').send(body).expect(201, body);
  });

  afterEach(async () => {
    await app.close();
  });
});
