import { IsDateString, IsMongoId, IsString } from "class-validator";

export class Session {
  @IsMongoId() id: string;
  @IsMongoId() userId: string;
  @IsString() accessToken: string;
  @IsString() refreshToken: string;
  @IsDateString() expiresAt: string;
  @IsDateString() updatedAt: string;
}
