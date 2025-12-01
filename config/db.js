import 'dotenv/config';
import mysql from 'mysql2/promise';

let sql;

try {
    sql = await mysql.createPool({
        host: process.env.DB_SERVER,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        port: parseInt(process.env.DB_PORT)
    });

    const testConnection = await sql.getConnection();
    console.log("✅ Connected to MySQL Database");
    testConnection.release();

} catch (error) {
    console.error("❌ Database Connection Failed:", error.message);
    process.exit(1);
}

export { sql };
