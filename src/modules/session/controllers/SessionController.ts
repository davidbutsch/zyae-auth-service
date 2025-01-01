import { Body, Delete, JsonController, Post, Req } from "routing-controllers";

import { CredentialsDTO } from "@/modules/session";
import { IUserService } from "@/modules/user";
import { Request } from "express";
import { inject, injectable } from "tsyringe";

@injectable()
@JsonController("/sessions")
export class SessionController {
  constructor(@inject("UserService") private userService: IUserService) {}

  @Post("/")
  async saveSession(@Req() req: Request, @Body() credentials: CredentialsDTO) {
    const user = await this.userService.findByCredentials(credentials);

    req.session.user = user;

    return { message: "Success" };
  }

  @Delete("/")
  async deleteSession(@Req() req: Request) {
    // TODO refactor to service layer
    // promisify req.session.destroy
    await new Promise<void>((resolve, reject) =>
      req.session.destroy((error) => {
        if (error) reject(error);
        else resolve();
      })
    );

    return { message: "Success" };
  }
}
