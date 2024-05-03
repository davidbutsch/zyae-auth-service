import { IsEmail, IsOptional, IsString } from "class-validator";

export class CreateUserDTO {
  @IsEmail() email: string;
  @IsString() firstName: string;
  @IsOptional() @IsString() lastName?: string;
  @IsString() password: string;
}
