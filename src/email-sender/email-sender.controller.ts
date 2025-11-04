// src/queues/producer.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { ProducerProvider } from './providers/producer.provider';

@Controller('email-sender')
export class EmailSenderController {
  constructor(private readonly producer: ProducerProvider) {}

  @Post('welcome')
  async enqueue(@Body() body: { to: string; name: string }) {
    return this.producer.sendWelcomeEmail(body);
  }

  @Post('welcome-later')
  async later(@Body() body: { to: string; name: string }) {
    return this.producer.sendWelcomeLater(body);
  }

  @Post('welcome-daily')
  async daily(@Body() body: { to: string; name: string }) {
    return this.producer.scheduleDaily(body);
  }
}
