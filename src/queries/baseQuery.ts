// src/query/baseQuery.ts
import { Pool } from 'mysql2/promise';
import { Database } from '@/src/configs/db.config';

const pool: Pool = Database.getInstance().getPool();

export async function query<T = any>(sql: string, params?: any[]): Promise<T[]> {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows as T[];
  } catch (err) {
    console.error(`[Query Error] (PID: ${process.pid}) SQL: ${sql}`, err);
    throw err;
  }
}

export async function queryOne<T = any>(sql: string, params: any[]): Promise<T | null> {
  const result = await query<T>(sql, params);
  return result.length > 0 ? result[0] : null;
}
