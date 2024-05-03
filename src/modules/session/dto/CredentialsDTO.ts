import { IsEmail, IsString } from "class-validator";

export class CredentialsDTO {
  @IsEmail() email: string;
  @IsString() password: string;
}
