import { Pool } from "pg";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT as string, 10),
});

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS as string, 10);


async function hashPasswords() {
  try {
    const res = await pool.query("SELECT id, password_digest FROM users");
    for (let row of res.rows) {
      const { id, password_digest } = row;
      
      if (!password_digest.startsWith("$2b$")) {
        const hashed = await bcrypt.hash(password_digest, SALT_ROUNDS);
        await pool.query(
          "UPDATE users SET password_digest=$1 WHERE id=$2",
          [hashed, id]
        );
        console.log(`Hashed password for user ${id}`);
      }
    }
    console.log("Done hashing passwords!");
    await pool.end();
  } catch (err) {
    console.error(err);
    await pool.end();
  }
}

hashPasswords();
