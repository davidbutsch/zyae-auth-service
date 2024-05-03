import { IsOptional, IsString } from "class-validator";

export class GoogleOAuth2CallbackQuery {
  @IsOptional() @IsString() state?: string;
  @IsOptional() @IsString() code?: string;
  @IsOptional() @IsString() error?: string;
}
