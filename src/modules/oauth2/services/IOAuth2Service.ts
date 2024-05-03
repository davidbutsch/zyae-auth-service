import { UserDTO } from "@/modules/user";

export interface IOAuth2Service {
  getAuthUrl(state?: { [key: string]: string }): string;
  getTokens(code: string): any;
  createAuthProviderUser(keys: any): Promise<UserDTO>;
}
