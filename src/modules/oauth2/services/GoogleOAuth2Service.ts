import { config, DEFAULT_USER_THUMBNAIL_URL } from "@/common";
import { IOAuth2Service } from "@/modules/oauth2";
import { IUserRepository, User, UserDTO, UserProducer } from "@/modules/user";
import { Credentials as GoogleCredentials } from "google-auth-library";
import { google } from "googleapis";
import { InternalServerError } from "routing-controllers";
import { inject, injectable } from "tsyringe";

const CALLBACK_URL = "https://zyae.net/auth/api/oauth2/google/callback";

const SCOPE = [
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
];

@injectable()
export class GoogleOAuth2Service implements IOAuth2Service {
  private googleAuthClient = new google.auth.OAuth2(
    config.googleClient.id,
    config.googleClient.secret,
    CALLBACK_URL
  );

  constructor(
    @inject("UserRepository") private userRepository: IUserRepository,
    @inject("UserProducer") private userProducer: UserProducer
  ) {}

  getAuthUrl(state?: { [key: string]: string }): string {
    const url = this.googleAuthClient.generateAuthUrl({
      scope: SCOPE,
      prompt: "consent",
      access_type: "offline",
      state: JSON.stringify(state),
    });

    return url;
  }
  async getTokens(code: string) {
    const { tokens } = await this.googleAuthClient.getToken(code);
    return tokens;
  }
  async createAuthProviderUser(credentials: GoogleCredentials) {
    this.googleAuthClient.setCredentials({
      access_token: credentials.access_token,
    });
    const oauth2 = google.oauth2({
      auth: this.googleAuthClient,
      version: "v2",
    });
    const { data } = await oauth2.userinfo.get();

    if (!(data.email && data.given_name))
      throw new InternalServerError(
        "Missing Oauth2 data.email & data.given_name"
      );

    let userEntity: User;

    const userWithThisEmail = await this.userRepository.findOneByFilter({
      email: data.email,
    });

    if (userWithThisEmail) userEntity = userWithThisEmail;
    else {
      const newUser: Partial<User> = {
        email: data.email,
        displayName: data.given_name,
        thumbnail: data.picture || DEFAULT_USER_THUMBNAIL_URL,
      };

      const newUserEntity = await this.userRepository.create(newUser);

      this.userProducer.create(newUserEntity);

      userEntity = newUserEntity;
    }

    return UserDTO.toDTO(userEntity);
  }
}
