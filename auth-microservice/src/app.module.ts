import { Module } from '@nestjs/common';
import { AuthMicroserviceModule } from './auth/auth.microservice.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpEntity } from './auth/otp.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      entities: [OtpEntity],
      synchronize: true,
    }),
    AuthMicroserviceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
