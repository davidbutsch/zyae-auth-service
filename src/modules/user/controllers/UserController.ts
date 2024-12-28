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
  Res,
  UseBefore,
} from "routing-controllers";

import { Response } from "express";

import { AttachSession } from "@/middlewares";
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

  @UseBefore(AttachSession)
  @Get("/me")
  async getMe(@Res() res: Response) {
    const session = res.locals.session;

    const user = await this.userService.findById(session.userId);

    return {
      data: { user },
    };
  }

  @Head("/")
  async checkUserWithEmailExists(
    @QueryParam("email") email: string,
    @Res() res: Response
  ) {
    const user = await this.userRepository.findByFilter(
      { profile: { email } },
      { lean: true }
    );

    if (user) return res.status(200).end();
    else return res.status(404).end();
  }

  @HttpCode(201)
  @Post("/")
  async create(@Body() user: CreateUserDTO) {
    const newUser = await this.userService.create(user);

    return {
      data: { user: newUser },
    };
  }

  @UseBefore(AttachSession)
  @Patch("/me")
  async updateMe(
    @Res() res: Response,
    @Body({ validate: { skipMissingProperties: true } }) update: UpdateUserDTO
  ) {
    const session = res.locals.session;

    const user = await this.userService.update(session.userId, update);

    return {
      data: { user },
    };
  }

  @UseBefore(AttachSession)
  @Delete("/me")
  async deleteMe(@Res() res: Response) {
    const session = res.locals.session;

    const user = await this.userService.delete(session.userId);

    return {
      data: { user },
    };
  }
}
