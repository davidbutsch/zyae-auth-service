import { IsDateString, IsString } from "class-validator";

export class Session {
  @IsString() id: string;
  @IsString() userId: string;
  @IsString() accessToken: string;
  @IsString() refreshToken: string;
  @IsDateString() expiresAt: string;
  @IsDateString() updatedAt: string;
}
