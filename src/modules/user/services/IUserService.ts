import { CreateUserDTO, UpdateUserDTO, UserDTO } from "@/modules/user";

import { CredentialsDTO } from "@/modules/session";

export interface IUserService {
  findById(id: string): Promise<UserDTO>;
  findByCredentials(credentials: CredentialsDTO): Promise<UserDTO>;
  create(user: CreateUserDTO): Promise<UserDTO>;
  update(id: string, update: UpdateUserDTO): Promise<UserDTO>;
  delete(id: string): Promise<void>;
}
