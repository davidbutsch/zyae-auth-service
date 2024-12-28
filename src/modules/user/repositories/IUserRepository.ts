import { User } from "@/modules/user";

export interface IUserRepository {
  findAllByFilter(filter: Partial<User>): Promise<User | null>;
  findOneByFilter(filter: Partial<User>): Promise<User | null>;
  create(user: Partial<User>): Promise<User>;
  update(id: string, update: Partial<User>): Promise<User | null>;
  delete(id: string): Promise<User | null>;
}
