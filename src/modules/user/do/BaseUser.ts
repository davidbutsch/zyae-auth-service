import { IsEmail, IsNumber, IsString, IsUrl } from "class-validator";

export class BaseUser {
  @IsNumber() id: string;
  @IsString() displayName: string;
  @IsEmail() email: string;
  @IsUrl() thumbnail: string;
}
