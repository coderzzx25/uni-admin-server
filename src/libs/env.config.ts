import { ConfigModule } from '@nestjs/config';

const configModel = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: ['.env.development', '.env.production'],
});

export default configModel;
