import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthMicroserviceService } from './auth.microservice.service';
import { AdminLoginDto, VerifyOtpDto } from './auth.dto';
import { LoginDto } from 'src/auth/users/users.dto';
import { lastValueFrom } from 'rxjs';
import { ApiResponse } from 'src/api.response';

@Controller()
export class AuthMicroserviceController {
  constructor(private authMicroserviceService: AuthMicroserviceService) {}

  @MessagePattern({ cmd: 'sendOtpToCreateNewUser' })
  async sendOtpToCreateNewUser(@Payload() email: string) {
    const otpForEmail =
      await this.authMicroserviceService.checkIfOtpAlreadyExistsForEmail(email);

    if (!!otpForEmail)
      return new ApiResponse(
        'fail',
        409,
        'otp already exists for this email, not expired yet',
        null,
      );

    const userExists = await lastValueFrom(
      this.authMicroserviceService.findUserByEmail(email),
    );
    if (!!userExists)
      return new ApiResponse(
        'fail',
        409,
        'this user with this email already exists',
        null,
      );

    const otp =
      await this.authMicroserviceService.createOtpSaveOtpSendOtp(email);
    return new ApiResponse(
      'success',
      201,
      'otp successfully created, saved in db and sent to the user email',
      otp.otp,
    );
  }

  @MessagePattern({ cmd: 'sendOtpWhenForgotPassword' })
  async sendOtpWhenForgotPassword(@Payload() email: string) {
    const otpForEmail =
      await this.authMicroserviceService.checkIfOtpAlreadyExistsForEmail(email);

    if (!!otpForEmail)
      return new ApiResponse(
        'fail',
        409,
        'otp already exists for this email, not expired yet',
        null,
      );

    const userExists = await lastValueFrom(
      this.authMicroserviceService.findUserByEmail(email),
    );
    if (!userExists)
      return new ApiResponse('fail', 401, 'this email is not registered', null);

    const otp = this.authMicroserviceService.createOtpSaveOtpSendOtp(email);
    return new ApiResponse(
      'success',
      201,
      'otp successfully created, saved in db and sent to the user email',
      otp,
    );
  }

  @MessagePattern({ cmd: 'checkUserOtp' })
  async checkUserOtp(@Payload() userEmailAndOtp: VerifyOtpDto) {
    const { email, otp: userOtp } = userEmailAndOtp;
    const otpRecordInDb =
      await this.authMicroserviceService.findOtpByEmail(email);

    if (!otpRecordInDb)
      return new ApiResponse('fail', 400, 'no oto fot this user', null);

    if (userOtp !== otpRecordInDb.otp)
      return new ApiResponse('fail', 401, 'wrong otp', null);

    return new ApiResponse('success', 200, 'right otp', userOtp);
  }

  @MessagePattern({ cmd: 'login' })
  async login(@Payload() userLoginCredentials: LoginDto) {
    const user =
      await this.authMicroserviceService.validateUser(userLoginCredentials);

    if (!user)
      return new ApiResponse('fail', 401, 'email or password is wrong', null);

    return await this.authMicroserviceService.login(user);
  }

  @MessagePattern({ cmd: 'adminLogin' })
  async adminLogin(@Payload() adminLoginCredentials: AdminLoginDto) {
    const user = await this.authMicroserviceService.validateAdmin(
      adminLoginCredentials,
    );

    if (!user)
      return new ApiResponse(
        'fail',
        401,
        'usrename or password is wrong',
        null,
      );

    return await this.authMicroserviceService.login(user);
  }
}
