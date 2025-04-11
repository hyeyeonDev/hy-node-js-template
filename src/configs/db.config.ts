// src/configs/db/Database.ts
import { createPool, Pool } from 'mysql2/promise';

export class Database {
  private pool: Pool;
  private static instances: { [key: string]: Database } = {};

  private constructor(config: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
    connectionLimit: number;
  }) {
    this.pool = createPool({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      waitForConnections: true,
      connectionLimit: config.connectionLimit,
      queueLimit: 0,
      multipleStatements: true,
    });

    this.pool.on('connection', () => {
      console.log(`[Database] New connection created for ${config.database} (PID: ${process.pid})`);
    });
    this.pool.on('enqueue', () => {
      console.log(`[Database] Query queued for ${config.database} (PID: ${process.pid})`);
    });
  }

  static getInstance(
    clientId: string,
    config: {
      host: string;
      port: number;
      user: string;
      password: string;
      database: string;
      connectionLimit: number;
    }
  ): Database {
    if (!Database.instances[clientId]) {
      Database.instances[clientId] = new Database(config);
    }
    return Database.instances[clientId];
  }

  static resetInstance(clientId: string): void {
    if (process.env.NODE_ENV !== 'production') {
      delete Database.instances[clientId];
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
