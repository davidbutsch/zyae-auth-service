import { User } from "@/modules/user";

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  create(user: Partial<User>): Promise<User>;
  update(id: string, update: Partial<User>): Promise<User | null>;
  delete(id: string): Promise<User | null>;
}
