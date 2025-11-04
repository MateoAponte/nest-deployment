// src/queues/producer.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { Queue, JobsOptions } from 'bullmq';
import { EMAIL_KEY } from 'src/redis/constants/RedisKeys';

@Injectable()
export class ProducerProvider {
  constructor(@Inject(EMAIL_KEY) private readonly queue: Queue) {}

  async sendWelcomeEmail(data: { to: string; name: string }) {
    const opts: JobsOptions = {
      // puedes override por job
      delay: 0, // o 10_000 para 10s
      priority: 2,
    };
    return this.queue.add('welcome', data, opts);
  }

  async sendWelcomeLater(data: any) {
    return this.queue.add('welcome', data, { delay: 15_000 }); // 15s después
  }

  async scheduleDaily(data: any) {
    // job recurrente (cada minuto como ejemplo)
    return this.queue.add(
      'welcome',
      data,
      { repeat: { pattern: '* * * * *' } }, // cron (cada minuto)
    );
  }
}
