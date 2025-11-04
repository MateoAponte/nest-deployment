import { Module } from '@nestjs/common';
import { ProducerProvider } from './providers/producer.provider';
import { EmailSenderController } from './email-sender.controller';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [ProducerProvider],
  controllers: [EmailSenderController],
})
export class EmailSenderModule {}
