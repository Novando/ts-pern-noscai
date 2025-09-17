import dotenv from 'dotenv';

dotenv.config();

type EnvConfig = {
  nodeEnv: string;
  app: AppConfig;
  pg: PgConfig;
}

type AppConfig = {
  port: number;
  name: string;
}

type PgConfig = {
  user: string;
  password: string;
  host: string;
  port: number
  database: string;
  queryTimeout?: number | undefined;
  lockTimeout?: number | undefined;
  connectionTimeout?: number | undefined;
  idleInTransactionSessionTimeout?: number | undefined;
}

const appConfig: AppConfig = {
  port: Number(process.env.APP_PORT) || 3000,
  name: process.env.APP_NAME || '',
}

const pgConfig: PgConfig = {
  user: process.env.PG_USER || '',
  password: process.env.PG_PASS || '',
  host: process.env.PG_HOST || 'localhost',
  port: Number(process.env.PG_PORT) || 5432,
  database: process.env.PG_DB || '',
  queryTimeout: process.env.PG_QUERY_TIMEOUT ? parseInt(process.env.PG_QUERY_TIMEOUT) : undefined,
  lockTimeout: process.env.PG_LOCK_TIMEOUT ? parseInt(process.env.PG_LOCK_TIMEOUT) : undefined,
  connectionTimeout: process.env.PG_CONN_TIMEOUT ? parseInt(process.env.PG_CONN_TIMEOUT) : undefined,
  idleInTransactionSessionTimeout: process.env.PG_IDLE_TX_TIMEOUT ? parseInt(process.env.PG_IDLE_TX_TIMEOUT) : undefined,
}

export const envConfig: EnvConfig = {
  app: appConfig,
  pg: pgConfig,
  nodeEnv: process.env.NODE_ENV || 'development',
};