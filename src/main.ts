import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // await app.listen(3000);
  await app.listen(8081, '0.0.0.0');

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
