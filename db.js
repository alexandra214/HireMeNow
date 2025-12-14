import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log("Connected to MariaDB");

pool.getConnection()
  .then(conn => {
    console.log("DB connection test: OK");
    conn.release();
  })
  .catch(err => {
    console.error("DB connection failed:", err.message);
  });

export { pool };