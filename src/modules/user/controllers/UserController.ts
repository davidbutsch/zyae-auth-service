import {
  Body,
  Delete,
  Get,
  Head,
  HttpCode,
  JsonController,
  Patch,
  Post,
  QueryParam,
  Req,
  Res,
  UseBefore,
} from "routing-controllers";

import { Request, Response } from "express";

import { IsAuth } from "@/middlewares";
import {
  CreateUserDTO,
  IUserRepository,
  IUserService,
  UpdateUserDTO,
} from "@/modules/user";
import { inject, injectable } from "tsyringe";

@injectable()
@JsonController("/users")
export class UserController {
  constructor(
    @inject("UserService") private userService: IUserService,
    @inject("UserRepository") private userRepository: IUserRepository
  ) {}

  @UseBefore(IsAuth)
  @Get("/me")
  async getMe(@Req() req: Request) {
    const user = req.session.user!; // IsAuth middleware checks if session.user is defined

    return {
      user,
    };
  }

  @Head("/")
  async checkUserWithEmailExists(
    @QueryParam("email") email: string,
    @Res() res: Response
  ) {
    const user = await this.userRepository.findOneByFilter({ email });

    if (user) return res.status(200).end();
    else return res.status(404).end();
  }

  @HttpCode(201)
  @Post("/")
  async create(@Body() user: CreateUserDTO) {
    const newUser = await this.userService.create(user);

    return {
      user: newUser,
    };
  }

  @UseBefore(IsAuth)
  @Patch("/me")
  async updateMe(
    @Req() req: Request,
    @Body({ validate: { skipMissingProperties: true } }) update: UpdateUserDTO
  ) {
    const userId = req.session.user!.id; // IsAuth

    const user = await this.userService.update(userId, update);

    req.session.user = user; // update user in session store

    return {
      user,
    };
  }

  @UseBefore(IsAuth)
  @Delete("/me")
  async deleteMe(@Req() req: Request) {
    const userId = req.session.user!.id;

    await this.userService.delete(userId);

    // TODO refactor to service layer
    // promisify req.session.destroy
    await new Promise<void>((resolve, reject) =>
      req.session.destroy((error) => {
        if (error) reject(error);
        else resolve();
      })
    );

    return {
      message: "Successful",
    };
  }
}
