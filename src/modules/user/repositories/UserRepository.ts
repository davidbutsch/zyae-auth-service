import { IUserRepository, User } from "@/modules/user";

import { pool } from "@/libs";

export class UserRepository implements IUserRepository {
  async findOneByFilter(filter: Partial<User>): Promise<User | undefined> {
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
    const { displayName, email, passwordHash, thumbnail } = user;

    const query = `
    INSERT INTO "user" ("displayName", email, "passwordHash", thumbnail)
    VALUES ($1, $2, $3, $4)

    RETURNING *;`;

    const values = [displayName, email, passwordHash, thumbnail];

    const { rows } = await pool.query<User>(query, values);

    return rows[0];
  }
  async update(id: string, update: Partial<User>): Promise<User | undefined> {
    const keys = Object.keys(update);
    const values = [...Object.values(update), id];

    const setClause = keys
      .map((key, index) => `"${key}" = $${index + 1}`)
      .join(", ");

    const query = `
      UPDATE "user"
      SET ${setClause}
      WHERE id = $${values.length}

      RETURNING *;`;

    const { rows } = await pool.query<User>(query, values);

    return rows[0];
  }
  async delete(id: string): Promise<User | null> {
    const values = [id];
    const query = `
      DELETE FROM "user"
      WHERE id = $1

      RETURNING *;`;

    const { rows } = await pool.query<User>(query, values);

    return rows[0];
  }
}
