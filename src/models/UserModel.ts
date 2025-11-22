import client from "../database";
import bcrypt from "bcryptjs";

const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env;

export async function hashPassword(password: string): Promise<string> {
  if (!BCRYPT_PASSWORD || !SALT_ROUNDS) {
    throw new Error("Missing BCRYPT_PASSWORD or SALT_ROUNDS env variable");
  }
  const saltRounds = parseInt(SALT_ROUNDS);
  // نستخدم try/catch هنا أيضاً للطرق المساعدة في حال فشل عملية التشفير لأي سبب
  try {
    return bcrypt.hash(password + BCRYPT_PASSWORD, saltRounds); // نستخدم hash بدلاً من hashSync في async function
  } catch (err) {
    throw new Error(`Could not hash password. Error: ${err}`);
  }
}

export type User = {
  id?: number;
  firstname: string;
  lastname: string;
  password?: string;
};

export class UserModel {
  async index(): Promise<User[]> {
    let conn;
    try {
      conn = await client.connect();
      const sql = "SELECT id, firstname, lastname FROM users";
      const result = await conn.query(sql);
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get users. Error: ${err}`);
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  async create(u: User): Promise<User> {
    if (!u.password) {
      throw new Error("Password is required");
    }
    let conn;
    try {
      conn = await client.connect();
      const hash = await hashPassword(u.password);
      const sql = "INSERT INTO users (firstname, lastname, password_digest) VALUES($1, $2, $3) RETURNING *";
      const result = await conn.query(sql, [u.firstname, u.lastname, hash]);
      return result.rows[0];
    } catch (err) {
      // إعادة رمي الخطأ مع رسالة توضيحية
      throw new Error(`Could not create user ${u.firstname} ${u.lastname}. Error: ${err}`);
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  async show(id: number): Promise<User> {
    let conn;
    try {
      conn = await client.connect();
      const sql = "SELECT id, firstname, lastname FROM users WHERE id=$1";
      const result = await conn.query(sql, [id]);
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find user ${id}. Error: ${err}`);
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  async authenticate(firstname: string, password: string): Promise<User | null> {
    let conn;
    try {
      conn = await client.connect();
      const sql = "SELECT * FROM users WHERE firstname=$1";
      const result = await conn.query(sql, [firstname]);
      
      if (result.rows.length) {
        const user = result.rows[0];
        // نستخدم compare بدلاً من compareSync في async function
        const valid = await bcrypt.compare(password + BCRYPT_PASSWORD, user.password_digest);
        
        if (valid) return { id: user.id, firstname: user.firstname, lastname: user.lastname };
      }
      return null;
    } catch (err) {
      throw new Error(`Could not authenticate user ${firstname}. Error: ${err}`);
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }
}