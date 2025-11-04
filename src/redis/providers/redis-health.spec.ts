import { Test, TestingModule } from '@nestjs/testing';
import { RedisHealth } from './redis-health';

describe('RedisHealth', () => {
  let provider: RedisHealth;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedisHealth],
    }).compile();

    provider = module.get<RedisHealth>(RedisHealth);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
