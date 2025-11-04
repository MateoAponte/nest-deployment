// src/redis/redis.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import IORedis from 'ioredis';
import { RedisHealth } from './providers/redis-health';
import databaseConfig from 'src/config/database.config';

@Module({
  imports: [ConfigModule.forFeature(databaseConfig)],
  providers: [
    {
      provide: 'REDIS',
      inject: [databaseConfig.KEY],
      useFactory: (db: ConfigType<typeof databaseConfig>) => {
        const redisUrl = db.redis ?? 'redis://localhost:6379';

        const isSecure = redisUrl.startsWith('rediss://');

        return new IORedis(redisUrl, {
          maxRetriesPerRequest: null,
          tls: isSecure ? {} : undefined,
        });
      },
    },
    RedisHealth,
  ],
  exports: ['REDIS'],
})
export class RedisModule {}
