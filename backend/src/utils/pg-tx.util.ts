// src/utils/transaction.ts
import { Pool } from "pg";
import { setAsyncLocalStorage } from "./local-storage.util";
import {Logger} from "./logger.util";

export async function withTx<T>(pool: Pool, fn: () => Promise<T>): Promise<T> {
  const client = await pool.connect();
  
  try {
    await client.query("BEGIN");
    Logger.info("Tx Begin")
    setAsyncLocalStorage('pgTx', client); // inject into context
    const result = await fn();

    await client.query("COMMIT");
    Logger.info("Tx Commited")

    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    Logger.info("Tx Rolled back")
    throw err;
  } finally {
    client.release();
  }
}
