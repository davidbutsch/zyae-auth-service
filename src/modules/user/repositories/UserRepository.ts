import { IUserRepository, User } from "@/modules/user";

import { pool } from "@/libs";

export class UserRepository implements IUserRepository {
  findAllByFilter(filter: Partial<User>): Promise<User | null> {
    throw new Error("Method not implemented.");
  }
  findOneByFilter(filter: Partial<User>): Promise<User | null> {
    throw new Error("Method not implemented.");
  }
  async findByFilter(filter: Partial<User>): Promise<User | null> {
    const keys = Object.keys(filter);
    const values = Object.values(filter);

    const conditions = keys.map((key, index) => `${key} = $${index + 1}`);

    const query = `
    SELECT * FROM "user"
    WHERE ${conditions.join(" AND ")}`;

    const { rows } = await pool.query<User>(query, values);

    return rows[0];
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
