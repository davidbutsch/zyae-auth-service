import { User } from "@/modules/user";
import { IsEmail, IsString, IsUrl } from "class-validator";

// TODO update password method

export class UpdateUserDTO implements Omit<User, "id" | "passwordHash"> {
  @IsString() displayName: string;
  @IsEmail() email: string;
  @IsUrl() thumbnail: string;
}
