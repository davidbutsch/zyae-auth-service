import { User } from "@/modules/user";

export interface IUserRepository {
  findOneByFilter(filter: Partial<User>): Promise<User | undefined>;
  create(user: Partial<User>): Promise<User>;
  update(id: string, update: Partial<User>): Promise<User | undefined>;
  delete(id: string): Promise<User | null>;
}
