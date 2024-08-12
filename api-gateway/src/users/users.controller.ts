import { Body, Controller, Inject, Post, Put } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateNewUserDto, UpdateUserDto } from 'src/users/users.dto';

@Controller('users')
export class UsersController {
  constructor(@Inject('USERS_SERVICE') private usersClient: ClientProxy) {}

  @Post('cerate-new-user')
  createNewUser(@Body() createNewUserCredentials: CreateNewUserDto) {
    return this.usersClient.send(
      { cmd: 'createNewUser' },
      //
      createNewUserCredentials,
    );
  }

  @Put('update-user-password')
  updateUserPassword(@Body() upateUserCredentials: UpdateUserDto) {
    return this.usersClient.send(
      { cmd: 'updateUserPassword' },
      upateUserCredentials,
    );
  }
}
