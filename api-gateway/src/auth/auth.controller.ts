import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AdminLoginDto, LoginDto, OtpDto, RequestOtpDto } from './auth.dto';
import { Role, Roles } from 'src/guard/roles.decorator';
import { RolesGuard } from 'src/guard/roles.guard';

@Controller('auth')
@UseGuards(RolesGuard)
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') private authClient: ClientProxy) {}

  @Post('send-otp-to-create-new-user')
  sendOtpToCreateNewUser(@Body() body: RequestOtpDto) {
    const { email } = body;

    return this.authClient.send({ cmd: 'sendOtpToCreateNewUser' }, email);
  }

  @Post('send-otp-when-forgot-password')
  sendOtpWhenForgotPassword(@Body() body: RequestOtpDto) {
    const { email } = body;

    return this.authClient.send({ cmd: 'sendOtpWhenForgotPassword' }, email);
  }

  @Post('check-otp')
  checkOtp(@Body() userEmailAndOtp: OtpDto) {
    return this.authClient.send({ cmd: 'checkUserOtp' }, userEmailAndOtp);
  }

  @Post('login')
  login(@Body() userLoginCredentials: LoginDto) {
    return this.authClient.send({ cmd: 'login' }, userLoginCredentials);
  }

  @Post('admin-login')
  adminLogin(@Body() adminLoginCredentials: AdminLoginDto) {
    return this.authClient.send({ cmd: 'adminLogin' }, adminLoginCredentials);
  }

  @Get('user-endpoint')
  @Roles(Role.USER)
  getUserEndpoint() {
    return 'This endpoint is accessible only by users with the User role.';
  }

  @Get('admin-endpoint')
  @Roles(Role.ADMIN)
  getAdminEndpoint() {
    return 'This endpoint is accessible only by users with the admin role.';
  }
}
