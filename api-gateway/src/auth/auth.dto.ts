import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class OtpDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(32)
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  @Transform(({ value }) => value.toLowerCase().trim())
  otp: string;
}

export class RequestOtpDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(32)
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;
}

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(32)
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  @Transform(({ value }) => value.trim())
  password: string;
}
export class AdminLoginDto {
  @IsNotEmpty()
  @MaxLength(32)
  @Transform(({ value }) => value.toLowerCase().trim())
  username: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  @Transform(({ value }) => value.trim())
  password: string;
}
