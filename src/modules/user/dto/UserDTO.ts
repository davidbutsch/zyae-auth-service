import {
  BaseUserFlags,
  BaseUserMetadata,
  BaseUserPreferences,
  BaseUserProfile,
  User,
  UserModel,
} from "@/modules/user";
import {
  IsDefined,
  IsNotEmptyObject,
  IsString,
  ValidateNested,
} from "class-validator";

import { Type } from "class-transformer";

export class UserDTO implements Omit<User, "_id"> {
  @IsString() id: string;

  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => BaseUserProfile)
  profile: BaseUserProfile;

  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => BaseUserPreferences)
  preferences: BaseUserPreferences;

  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => BaseUserFlags)
  flags: BaseUserFlags;

  @IsDefined()
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
