// src/redis/redis.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import IORedis from 'ioredis';
import { RedisHealth } from './providers/redis-health';
import databaseConfig from 'src/config/database.config';
import {
  EMAIL_KEY,
  EMAIL_SCHEDULER,
  EMAIL_WORKER,
  REDIS_KEY,
} from './constants/RedisKeys';
import { EMAIL_QUEUE } from './constants/QueuesKeys';
import { Queue, JobScheduler, Worker } from 'bullmq';

@Module({
  imports: [ConfigModule.forFeature(databaseConfig)],
  providers: [
    {
      provide: REDIS_KEY,
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

    // Cola
    {
      provide: EMAIL_KEY,
      useFactory: (conn: IORedis) =>
        new Queue(EMAIL_QUEUE, {
          connection: conn,
          defaultJobOptions: {
            attempts: 5,
            backoff: { type: 'exponential', delay: 1000 },
            removeOnComplete: { age: 3600, count: 1000 },
            removeOnFail: { age: 24 * 3600 },
          },
        }),
      inject: [REDIS_KEY],
    },

    // Scheduler (necesario para jobs retrasados/recurrentes)
    {
      provide: EMAIL_SCHEDULER,
      useFactory: (conn: IORedis) =>
        new JobScheduler(EMAIL_QUEUE, { connection: conn }),
      inject: [REDIS_KEY],
    },

    // Worker (lo arrancaremos solo en el proceso de “worker”)
    {
      provide: EMAIL_WORKER,
      useFactory: (conn: IORedis) =>
        new Worker(
          EMAIL_QUEUE,
          async (job) => {
            console.log('🟡 Recibido job:', job.name, job.data);

            // 👇 Lógica de cada job
            if (job.name === 'welcome') {
              // simula envío email
              await new Promise((r) => setTimeout(r, 3000));
              console.log('✅ Email simulado enviado a', job.data.to);
              return { sentTo: job.data.to };
            }
          },
          {
            connection: conn,
            concurrency: 5,
            autorun: false, // importante: lo ejecutamos en worker.ts
          },
        ),
      inject: [REDIS_KEY],
    },
    RedisHealth,
  ],
  exports: [REDIS_KEY, EMAIL_KEY],
})
export class RedisModule {}
