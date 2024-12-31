import { IsString } from "class-validator";

import { BaseUser } from "./BaseUser";

export class User extends BaseUser {
  @IsString() passwordHash: string;
}
