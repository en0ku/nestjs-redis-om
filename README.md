<p align="center">
  This module provides fast and easy way for creating Redis data model in your <a href="https://github.com/nestjs/nest" target="blank" rel="noopener noreferrer">Nestjs</a> applications.
</p>
<p>
  <a href="https://github.com/redis/redis-om-node" target="blank" rel="noopener noreferrer">Redis OM</a> for Node.js makes it easy to add Redis to your Node.js application by mapping the Redis data structures you know and love to simple JavaScript objects. No more pesky, low-level commands, just pure code with a fluent interface.
</p>

Define an Entity:

```typescript
export interface UserEntity extends Entity {}
@Schema('user')
export class UserEntity {
  @Field({ type: 'number', sortable: true })
  id: number;

  @Field({ type: 'string', sortable: true })
  username: string;

  @Field({ type: 'date', sortable: true, field: 'registration_date' })
  registrationDate: boolean;

  @Field({ type: 'boolean', sortable: true, field: 'is_active' })
  isActive: boolean;
}
```

Create a nestjs module:

```typescript
@Module({
  imports: [RedisOmModule.forFeature([UserEntity])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
```

Import in the app module sync:

```typescript
@Module({
  imports: [
    RedisOmModule.forRoot({
      url: `redis://user:password@127.0.0.1:6379`,
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

or async:

```typescript
export const getRedisOmConfig = async (
  configService: ConfigService,
): Promise<RedisOmModuleOptions> => {
  const [user, password, host, port] = [
    configService.get('REDIS_USER'),
    configService.get('REDIS_PASSWORD'),
    configService.get('REDIS_HOST'),
    configService.get('REDIS_PORT'),
  ];
  return {
    url: `redis://${user}:${password}@${host}:${port}`,
  };
};
```

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RedisOmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getRedisOmConfig,
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

And use in a service

```typescript
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
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
```
