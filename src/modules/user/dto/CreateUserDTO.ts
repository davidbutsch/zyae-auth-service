import { IsEmail, IsString } from "class-validator";

export class CreateUserDTO {
  @IsEmail() email: string;
  @IsString() displayName: string;
  @IsString() password: string;
}
