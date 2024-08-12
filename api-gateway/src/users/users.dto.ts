import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateNewUserDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(32)
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @IsNotEmpty()
  @MaxLength(32)
  @Transform(({ value }) => value.trim())
  password: string;
}
export class UpdateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(32)
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @IsNotEmpty()
  @MaxLength(32)
  @Transform(({ value }) => value.trim())
  password: string;
}
