import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  console.log('Api Gateway microservice is running...');

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  // const PORT = process.env.port || 3000;
  // await app.listen(PORT, () => console.log(`Running on port ${PORT}`));
  app.enableCors();
  await app.listen(3000, () => console.log(`Running on port 3000`));
}
bootstrap();
