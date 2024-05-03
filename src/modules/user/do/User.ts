import { IsNotEmptyObject, IsString, ValidateNested } from "class-validator";

import { BaseUser } from "./BaseUser";
import { Type } from "class-transformer";
import { IsNullable } from "@/common";

export class UserSecurity {
  @IsNullable()
  @IsString()
  password: string | null;
}

export class User extends BaseUser {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => UserSecurity)
  security: UserSecurity;
}
