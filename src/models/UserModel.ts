import client from "../database";
import bcrypt from "bcryptjs";

const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env;

export async function hashPassword(password: string): Promise<string> {
  if (!BCRYPT_PASSWORD || !SALT_ROUNDS) {
    throw new Error("Missing BCRYPT_PASSWORD or SALT_ROUNDS env variable");
  }
  const saltRounds = parseInt(SALT_ROUNDS);
  return bcrypt.hashSync(password + BCRYPT_PASSWORD, saltRounds);
}

export type User = {
  id?: number;
  firstname: string;
  lastname: string;
  password?: string;
};

export class UserModel {
  async index(): Promise<User[]> {
    const conn = await client.connect();
    const sql = "SELECT id, firstname, lastname FROM users";
    const result = await conn.query(sql);
    conn.release();
    return result.rows;
  }

  async create(u: User): Promise<User> {
    if (!u.password) {
        throw new Error("Password is required");
    }
    const conn = await client.connect();
    try {
        const hash = await hashPassword(u.password);
        const sql = "INSERT INTO users (firstname, lastname, password_digest) VALUES($1, $2, $3) RETURNING *";
        const result = await conn.query(sql, [u.firstname, u.lastname, hash]);
        return result.rows[0];
    } finally {
        conn.release();
    }
  }

  async show(id: number): Promise<User> {
    const conn = await client.connect();
    const sql = "SELECT id, firstname, lastname FROM users WHERE id=$1";
    const result = await conn.query(sql, [id]);
    conn.release();
    return result.rows[0];
  }

  async authenticate(firstname: string, password: string): Promise<User | null> {
    const conn = await client.connect();
    const sql = "SELECT * FROM users WHERE firstname=$1";
    const result = await conn.query(sql, [firstname]);
    conn.release();

    if (result.rows.length) {
      const user = result.rows[0];
      const valid = bcrypt.compareSync(password + BCRYPT_PASSWORD, user.password_digest);
      if (valid) return { id: user.id, firstname: user.firstname, lastname: user.lastname };
    }
    return null;
  }
}
