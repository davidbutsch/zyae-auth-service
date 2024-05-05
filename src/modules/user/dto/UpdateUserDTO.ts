import { IsOptional, IsString, ValidateNested } from "class-validator";

import { IsISO6391 } from "@/common";
import { Type } from "class-transformer";

class UpdateUserProfile {
  @IsString() firstName: string;
  @IsOptional() @IsString() lastName?: string;
}

class UpdateUserPreferences {
  @IsISO6391() language: string;
}

// TODO add dedicated update pass, email, thumbnail methods

export class UpdateUserDTO {
  @ValidateNested()
  @Type(() => UpdateUserProfile)
  profile: UpdateUserProfile;

  @ValidateNested()
  @Type(() => UpdateUserPreferences)
  preferences: UpdateUserPreferences;
}
