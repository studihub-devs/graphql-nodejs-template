import { plainToClass } from 'class-transformer';
import { injectable } from 'inversify';
import IORedis, { KeyType, Redis, ValueType } from 'ioredis';

import { dayjs } from '../../utils/dayjs';
import { toObjectType } from '../../utils/to-object-type';
import { JsonService } from './json.service';

@injectable()
export class CacheService {
  private readonly _redis: Redis;
  constructor(private jsonService: JsonService) {
    this._redis = new IORedis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      username: process.env.REDIS_USER,
      password: process.env.REDIS_PWD,
      tls: process.env.REDIS_TLS ? {} : null,
    });
  }

  get redis(): Redis {
    return this._redis;
  }

  async getOrSet<T>(
    key: string,
    invalidator: () => T | Promise<T>,
    duration?: ReturnType<typeof dayjs.duration>,
    postHandler?: (json: T) => T,
  ): Promise<T> {
    const cachedValue = await this._redis.get(key);
    if (cachedValue) {
      return postHandler
        ? postHandler(this.jsonService.parse(cachedValue))
        : this.jsonService.parse(cachedValue);
    }
    const value = await invalidator();
    if (dayjs.isDuration(duration)) {
      await this._redis.setex(key, duration.asSeconds(), JSON.stringify(value));
    } else {
      await this._redis.set(key, JSON.stringify(value));
    }
    return value;
  }

  async getOrSetH<T>(
    key: string,
    field: string,
    invalidator: () => T | Promise<T>,
  ): Promise<T> {
    const cachedValue = await this._redis.hget(key, field);
    if (cachedValue) {
      return this.jsonService.parse(cachedValue);
    }
    const value = await invalidator();
    await this._redis.hset(key, field, JSON.stringify(value));
    return value;
  }

  async forceSetH<T>(
    key: string,
    field: string,
    invalidator: () => T | Promise<T>,
  ): Promise<T> {
    const value = await invalidator();
    await this._redis.hset(key, field, JSON.stringify(value));
    return value;
  }

  async get<T>(key: KeyType): Promise<T> {
    return this._redis
      .get(key)
      .then(value => (value ? this.jsonService.parse(value) : null));
  }

  async mget<T>(...keys: KeyType[]): Promise<T[]> {
    return (await this._redis.mget(...keys)).map(value =>
      value ? this.jsonService.parse(value) : null,
    );
  }

  async hget<T>(
    type: new (...args: never[]) => T,
    key: KeyType,
    field: string,
  ): Promise<T> {
    return this._redis
      .hget(key, field)
      .then(value =>
        value ? toObjectType(type, this.jsonService.parse(value)) : null,
      );
  }

  async hset(key: KeyType, field: string, value: ValueType): Promise<number> {
    return this._redis.hset(key, field, value);
  }

  async hmget<T>(key: KeyType, fields: string[]): Promise<T[]> {
    return (await this._redis.hmget(key, ...fields)).map(value =>
      value ? this.jsonService.parse(value) : null,
    );
  }

  async deletePrefix<T>(pattern: string): Promise<boolean> {
    const keys = await this._redis.keys(pattern);
    for (const idx in keys) {
      await this._redis.del(keys[idx]);
    }

    return true;
  }
  async deleteKey<T>(key: string): Promise<boolean> {
    await this._redis.del(key);
    return true;
  }
}
