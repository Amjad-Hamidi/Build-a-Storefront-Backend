import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const {
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_DB_TEST, // 🆕 يجب استيراد هذا المتغير
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  NODE_ENV, // 🆕 يجب استيراد هذا المتغير للتحقق من البيئة
} = process.env;

// 🔑 تحديد اسم قاعدة البيانات بناءً على البيئة
let databaseName: string;

if (NODE_ENV === "test") {
  databaseName = POSTGRES_DB_TEST as string;
} else {
  databaseName = POSTGRES_DB as string;
}

const client = new Pool({
  host: POSTGRES_HOST,
  database: databaseName, // 👈 استخدام المتغير المُحدد بناءً على البيئة
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  port: parseInt(POSTGRES_PORT as string),
});

export default client;