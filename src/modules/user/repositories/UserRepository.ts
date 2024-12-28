import { IUserRepository, User } from "@/modules/user";

import { pool } from "@/libs";

export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const query = `
      SELECT * FROM "user"
      WHERE id = ${id}`;

    const result = await pool.query<User>(query);

    console.log(result);

    return null;
  }
  async create(user: Partial<User>): Promise<User> {
    const { displayName, email, password } = user;

    const query = `
    INSERT INTO "user" (displayName, email, password)
    VALUES ($1, $2, $3)
    RETURNING *;`;

    const values = [displayName, email, password];

    const result = await pool.query(query, values);

    console.log(result);

    return null as unknown as User;
  }
  update(id: string, update: Partial<User>): Promise<User | null> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<User | null> {
    throw new Error("Method not implemented.");
  }
}
