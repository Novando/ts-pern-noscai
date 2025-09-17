import { Pool } from "pg";
import { envConfig } from "../configs/config.config";
import { Logger } from "../utils/logger.util";


export async function initPg(): Promise<Pool> {
  const pg = new Pool({
    host: envConfig.pg.host,
    port: envConfig.pg.port,
    password: envConfig.pg.password,
    user: envConfig.pg.user,
    database: envConfig.pg.database,
    query_timeout: envConfig.pg.queryTimeout,
    lock_timeout: envConfig.pg.lockTimeout,
    connectionTimeoutMillis: envConfig.pg.connectionTimeout,
    idle_in_transaction_session_timeout: envConfig.pg.idleInTransactionSessionTimeout,
  })

  Logger.info(`connecting postgresql://${pg.options.user}:xxx@${pg.options.host}:${pg.options.port}/${pg.options.database}`)
  try {
    await pg.query('SELECT 1')
    Logger.info(`Database ${pg.options.database} connected on ${pg.options.host}:${pg.options.port}`)

    return pg
  } catch (e) {
    Logger.error(`PostgreSQL connection failed`, e as Error)
    throw e
  }
}