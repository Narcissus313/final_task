export class CreateNewUserDto {
  email: string;

  password: string;
}

export class LoginDto {
  email: string;

  password: string;
}

export class AdminLoginDto {
  username: string;

  password: string;
}

export class UserDto {
  email: string;

  password: string;

  id: string;

  createdAt: Date;
}
