export class CreateUserDto {
  email: string;
  password: string;
}

export class UserCredentialsToLoginDto {
  email: string;
  password: string;
}

export class VerifyOtpDto {
  email: string;
  otp: string;
}

export class UserDto {
  email: string;

  password: string;

  id: string;

  role: string;

  createdAt: Date;
}

export class AdminLoginDto {
  username: string;

  password: string;

  id: string;

  createdAt: Date;

  role: string;
}
