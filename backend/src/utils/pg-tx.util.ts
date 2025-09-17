// src/utils/transaction.ts
import { Pool } from "pg";
import { setAsyncLocalStorage } from "./local-storage.util";

export async function withTx<T>(pool: Pool, fn: () => Promise<T>): Promise<T> {
  const client = await pool.connect();
  
  try {
    await client.query("BEGIN");
    setAsyncLocalStorage('pgTx', client); // inject into context
    const result = await fn();

    await client.query("COMMIT");

    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
