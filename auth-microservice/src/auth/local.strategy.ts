import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthMicroserviceService } from './auth.microservice.service';
import { UserCredentialsToLoginDto } from './auth.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthMicroserviceService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(userLoginCredentials: UserCredentialsToLoginDto) {
    const user = await this.authService.validateUser(userLoginCredentials);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
