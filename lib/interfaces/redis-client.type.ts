import * as redis from 'redis';

export type RedisClient = ReturnType<typeof redis.createClient>;
export type RedisClientOptions = Parameters<typeof redis.createClient>[0];
