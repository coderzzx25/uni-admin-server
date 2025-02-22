import { ConfigService } from '@nestjs/config';
import { Provider } from '@nestjs/common';
import Redis from 'ioredis';

const redisModule: Provider = {
  provide: 'REDIS_CLIENT',
  useFactory: (configService: ConfigService) => {
    return new Redis({
      host: configService.get<string>('NEST_REDIS_HOST'),
      port: configService.get<number>('NEST_REDIS_PORT'),
    });
  },
  inject: [ConfigService],
};

export default redisModule;
