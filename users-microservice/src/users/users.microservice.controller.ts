import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateNewUserDto, UpdateUserDto } from './users.dto';
import { UsersMicroserviceService } from './users.microservice.service';
import { ApiResponse } from './api.response';
import { AdminLoginDto } from 'src/auth/auth.dto';

@Controller()
export class UsersMicroserviceController {
  constructor(private usersMicroserviceService: UsersMicroserviceService) {}

  @MessagePattern({ cmd: 'createNewUser' })
  async createNewUser(@Payload() createNewUserInfo: CreateNewUserDto) {
    const { email } = createNewUserInfo;
    const userExists =
      await this.usersMicroserviceService.findUserByEmail(email);
    if (!!userExists)
      return new ApiResponse('fail', 409, 'user is already registered', null);

    const newUser =
      await this.usersMicroserviceService.createNewUser(createNewUserInfo);

    const { password, ...rest } = newUser;
    return new ApiResponse('success', 201, 'user created successfully', rest);
  }

  @MessagePattern({ cmd: 'updateUserPassword' })
  async updateUser(@Payload() upateUserCredentials: UpdateUserDto) {
    const { email } = upateUserCredentials;
    const userExists =
      await this.usersMicroserviceService.findUserByEmail(email);
    if (!userExists)
      return new ApiResponse('fail', 400, "user doesn'nt exist", null);

    const updatedUser =
      await this.usersMicroserviceService.updateUser(upateUserCredentials);

    const { password, ...rest } = updatedUser;

    return new ApiResponse(
      'success',
      201,
      'user password updated successfully',
      rest,
    );
  }

  @MessagePattern({ cmd: 'checkUserExistance' })
  async checkUserExistance(@Payload() email: string) {
    return await this.usersMicroserviceService.findUserByEmail(email);
  }

  @MessagePattern({ cmd: 'findAdmin' })
  async fdafdgi(@Payload() adminCredentials: AdminLoginDto) {
    const result =
      await this.usersMicroserviceService.findAdmin(adminCredentials);

    if (!result) return null;

    return result;
  }
}
