import {
  BaseUserFlags,
  BaseUserMetadata,
  BaseUserPreferences,
  BaseUserProfile,
  User,
  UserModel,
} from "@/modules/user";
import { IsNotEmptyObject, IsString, ValidateNested } from "class-validator";

import { Type } from "class-transformer";

export class UserDTO implements Omit<User, "_id" | "security"> {
  @IsString() id: string;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => BaseUserProfile)
  profile: BaseUserProfile;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => BaseUserPreferences)
  preferences: BaseUserPreferences;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => BaseUserFlags)
  flags: BaseUserFlags;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => BaseUserMetadata)
  metadata: BaseUserMetadata;

  static toDTO(domain: User): UserDTO {
    if (domain instanceof UserModel) domain = domain.toObject();

    const userDTO: UserDTO = {
      id: domain._id.toString(),
      profile: domain.profile,
      preferences: domain.preferences,
      flags: domain.flags,
      metadata: domain.metadata,
    };

    return userDTO;
  }
}
