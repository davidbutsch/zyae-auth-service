import {
  CreateUserDTO,
  IUserRepository,
  IUserService,
  UpdateUserDTO,
  User,
  UserDTO,
  UserProducer,
} from "@/modules/user";
import { Types } from "mongoose";

import { DEFAULT_USER_THUMBNAIL_URL, objectToDotNotation } from "@/common";
import { AppError } from "@/errors";
import { CredentialsDTO } from "@/modules/session";
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "tsyringe";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject("UserRepository") private userRepository: IUserRepository,
    @inject("UserProducer") private userProducer: UserProducer
  ) {}

  async findById(id: string): Promise<UserDTO> {
    const user = await this.userRepository.findByFilter({ _id: id });

    if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found");

    return UserDTO.toDTO(user);
  }
  async findByCredentials(credentials: CredentialsDTO): Promise<UserDTO> {
    const user = await this.userRepository.findByFilter({
      profile: { email: credentials.email },
    });

    if (!user)
      throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid credentials");

    if (!user.security.password)
      throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid credentials");

    const passwordsMatch = await bcrypt.compare(
      credentials.password,
      user.security.password
    );

    if (!passwordsMatch)
      throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid credentials");

    return UserDTO.toDTO(user);
  }
  async create(user: CreateUserDTO): Promise<UserDTO> {
    const userWithThisEmail = await this.userRepository.findByFilter(
      { profile: { email: user.email } },
      {
        lean: true,
      }
    );

    if (userWithThisEmail)
      throw new AppError(StatusCodes.CONFLICT, "Email already taken");

    const newUser: Partial<User> = {
      profile: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        thumbnail: DEFAULT_USER_THUMBNAIL_URL,
      },
      security: {
        password: await bcrypt.hash(user.password, 10),
      },
    };

    const newUserDoc = await this.userRepository.create(newUser);

    this.userProducer.create(newUserDoc);

    return UserDTO.toDTO(newUserDoc);
  }
  async update(id: string, update: UpdateUserDTO): Promise<UserDTO> {
    const updatedUserDoc = await this.userRepository.update(
      id,
      { $set: objectToDotNotation(update) },
      {
        new: true,
      }
    );

    if (!updatedUserDoc)
      throw new AppError(StatusCodes.NOT_FOUND, "User not found");

    this.userProducer.update(updatedUserDoc);

    return UserDTO.toDTO(updatedUserDoc);
  }
  async delete(id: string | Types.ObjectId | undefined): Promise<UserDTO> {
    const deletedUserDoc = await this.userRepository.delete(id);

    if (!deletedUserDoc)
      throw new AppError(StatusCodes.NOT_FOUND, "User not found");

    if (id) this.userProducer.delete(id);

    return UserDTO.toDTO(deletedUserDoc);
  }
}
