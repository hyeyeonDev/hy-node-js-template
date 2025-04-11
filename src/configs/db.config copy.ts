// src/configs/db/Database.ts
import { createPool, Pool } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export class Database {
  private static instance: Database | undefined;
  private pool: Pool;

  private constructor() {
    const connectionLimit = parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10);
    this.pool = createPool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'mydb',
      waitForConnections: true,
      connectionLimit,
      queueLimit: 0,
      multipleStatements: true, // For bulk inserts
    });

    // Pool monitoring
    this.pool.on('connection', () => {
      console.log(`[Database] New connection created (PID: ${process.pid})`);
    });
    this.pool.on('enqueue', () => {
      console.log(`[Database] Query queued (PID: ${process.pid})`);
    });
  }

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  static resetInstance(): void {
    if (process.env.NODE_ENV !== 'production') {
      Database.instance = undefined;
    }
  }

  getPool(): Pool {
    return this.pool;
  }

  async checkHealth(): Promise<boolean> {
    try {
      await this.pool.query('SELECT 1');
      return true;
    } catch (err) {
      console.error(`[Database Health Check Error] (PID: ${process.pid})`, err);
      return false;
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
    console.log(`[Database] Pool closed (PID: ${process.pid})`);
  }
}
