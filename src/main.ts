import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EMAIL_WORKER } from './redis/constants/RedisKeys';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const worker = app.get(EMAIL_WORKER);

  worker.on('completed', (job, res) => {
    console.log('✅ completed', job.id, res);
  });
  worker.on('failed', (job, err) => {
    console.error('❌ failed', job?.id, err?.message);
  });

  // 👉 NO await
  if (process.env.ENABLE_WORKER !== 'false') {
    void worker.run(); // corre el loop del worker sin bloquear
    console.log('👷 Worker (inline) iniciado');
  }

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  console.log('🌐 API en', await app.getUrl());

  // cierre ordenado
  const shutdown = async () => {
    try {
      await worker.close();
    } catch {}
    await app.close();
    process.exit(0);
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}
bootstrap();
