import { Module } from '@nestjs/common';
import { UsersMicroserviceController } from './users.microservice.controller';
import { UsersMicroserviceService } from './users.microservice.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users.enitity';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'auth_microservice',
          port: 3001,
        },
      },
    ]),
  ],
  controllers: [UsersMicroserviceController],
  providers: [UsersMicroserviceService],
})
export class UsersModule {}
