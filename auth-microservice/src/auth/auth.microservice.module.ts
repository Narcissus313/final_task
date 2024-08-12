import { Module } from '@nestjs/common';
import { AuthMicroserviceController } from './auth.microservice.controller';
import { AuthMicroserviceService } from './auth.microservice.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpEntity } from './otp.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: 'USERS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'users_microservice',
          port: 3002,
        },
      },
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'auth_microservice',
          port: 3001,
        },
      },
    ]),
    TypeOrmModule.forFeature([OtpEntity]),
    ScheduleModule.forRoot(),
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: process.env.JWT_EXPIRE_TIME },
    }),
  ],
  controllers: [AuthMicroserviceController],
  providers: [AuthMicroserviceService, LocalStrategy, JwtStrategy],
})
export class AuthMicroserviceModule {}
