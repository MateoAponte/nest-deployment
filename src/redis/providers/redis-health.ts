import { Inject, Injectable } from '@nestjs/common';
import IORedis from 'ioredis';

@Injectable()
export class RedisHealth {
  constructor(@Inject('REDIS') private redis: IORedis) {}

  async onModuleInit() {
    const pong = await this.redis.ping();
    console.log('Redis OK:', pong); // debería imprimir "PONG"
  }
}
