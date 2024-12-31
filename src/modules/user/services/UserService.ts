import {
  CreateUserDTO,
  IUserRepository,
  IUserService,
  UpdateUserDTO,
  User,
  UserDTO,
  UserProducer,
} from "@/modules/user";

import { DEFAULT_USER_THUMBNAIL_URL } from "@/common";
import { CredentialsDTO } from "@/modules/session";
import { compare, hash } from "bcrypt";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "routing-controllers";
import { inject, injectable } from "tsyringe";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject("UserRepository") private userRepository: IUserRepository,
    @inject("UserProducer") private userProducer: UserProducer
  ) {}

  async findById(id: string): Promise<UserDTO> {
    const user = await this.userRepository.findOneByFilter({ id });

    if (!user) throw new NotFoundError("User not found");

    return UserDTO.toDTO(user);
  }
  async findByEmail(id: string): Promise<UserDTO> {
    const user = await this.userRepository.findOneByFilter({ id });

    if (!user) throw new NotFoundError("User not found");

    return UserDTO.toDTO(user);
  }
  async findByCredentials(credentials: CredentialsDTO): Promise<UserDTO> {
    const user = await this.userRepository.findOneByFilter({
      email: credentials.email,
    });

    // no user found
    if (!user) throw new UnauthorizedError("Invalid credentials");

    // user won't have a password hash if signed up via SSO
    if (!user.passwordHash) throw new UnauthorizedError("Invalid credentials");

    const passwordsMatch = await compare(
      credentials.password,
      user.passwordHash
    );

    if (!passwordsMatch) throw new UnauthorizedError("Invalid credentials");

    return UserDTO.toDTO(user);
  }
  async create(user: CreateUserDTO): Promise<UserDTO> {
    const userWithThisEmail = await this.userRepository.findOneByFilter({
      email: user.email,
    });

    if (userWithThisEmail) throw new BadRequestError("Email already taken");

    const passwordHash = await hash(user.password, 10);

    const newUser: Partial<User> = {
      email: user.email,
      displayName: user.displayName,
      thumbnail: DEFAULT_USER_THUMBNAIL_URL,
      passwordHash,
    };

    const newUserEntity = await this.userRepository.create(newUser);

    // emit new user event to all consumer services
    this.userProducer.create(newUserEntity);

    return UserDTO.toDTO(newUserEntity);
  }
  async update(id: string, update: UpdateUserDTO): Promise<UserDTO> {
    const updatedUserEntity = await this.userRepository.update(id, update);

    if (!updatedUserEntity) throw new NotFoundError("User not found");

    return UserDTO.toDTO(updatedUserEntity);
  }
  async delete(id: string): Promise<UserDTO> {
    const deletedUserEntity = await this.userRepository.delete(id);

    if (!deletedUserEntity) throw new NotFoundError("User not found");

    return UserDTO.toDTO(deletedUserEntity);
  }
}
