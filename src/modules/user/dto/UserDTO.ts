import { User } from "@/modules/user";
import { IsEmail, IsString } from "class-validator";

export class UserDTO implements Omit<User, "passwordHash"> {
  @IsString() id: string;
  @IsString() displayName: string;
  @IsEmail() email: string;
  @IsString() thumbnail: string;

  static toDTO(domain: User): UserDTO {
    const userDTO: UserDTO = {
      id: domain.id,
      displayName: domain.displayName,
      email: domain.email,
      thumbnail: domain.thumbnail,
    };

    return userDTO;
  }
}
