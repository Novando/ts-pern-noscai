import fs from 'fs';
import {join} from 'path';
import {Pool} from "pg";
import {envConfig} from "../src/configs/config.config";
import {version} from "node:os";

type MigrationAction = 'up' | 'down' | 'reset'

async function runMigrations() {
  const action = (process.argv[2] || 'up') as MigrationAction

  try {
    const pg = new Pool({
      host: envConfig.pg.host,
      port: envConfig.pg.port,
      password: envConfig.pg.password,
      user: envConfig.pg.user,
      database: envConfig.pg.database,
    })

    await await pg.query(`CREATE TABLE IF NOT EXISTS node_migrators (
      id BIGSERIAL PRIMARY KEY,
      version VARCHAR(255) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW() 
    )`);

    // @ts-ignore
    const migrationsDir = join(import.meta.dirname, '../db/migration');
    switch (action) {
      case 'up':
        await migrateUp(pg, migrationsDir);
        break;
      case 'down':
        await migrateDown(pg, migrationsDir);
        break;
      case 'reset':
        await migrateReset(pg, migrationsDir);
        break;
      default:
        console.log('Invalid action. Please use "up", "down", or "reset".');
        process.exit(1);
    }
  } catch (e) {
    console.error('Migration failed: ', (e as Error).message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

async function migrateUp(db: Pool, migrationsDir: string) {
  try {
    console.log('Pushing database migrations...');
    const res = await db.query("SELECT version FROM node_migrators")
    const versions = res.rows.map((row) => row.version)
    const scripts: string[] = []
    const availableVersions: string[] = []

    const files = fs.readdirSync(migrationsDir)
      .filter((file) => {
        const isVersion =  versions.includes(file.split('_')[0])
        return !isVersion && file.endsWith('.sql')
      }).sort()

    for (const file of files) {
      const migrationPath = join(migrationsDir, file);
      const migrationScripts = fs.readFileSync(migrationPath, 'utf8');

      const sqls = migrationScripts.split('-- +migrator UP')[1] || ''
      const sql =  sqls?.split('-- +migrator DOWN')[0] || ''
      await db.query(sql);

      const version = file.split('_')[0]
      await db.query("INSERT INTO node_migrators (version) VALUES ($1)", [version])
      console.log(`✓ Migration ${file} pushed`);
    }

    console.log('All migrations pushed successfully!');
  } catch (e) {
    console.error('Migration UP failed: ', (e as Error).message);
    process.exit(1);
  }
}

async function migrateDown(db: Pool, migrationsDir: string) {
  try {
    console.log('Rolling back database migrations...');
    const res = await db.query("SELECT version FROM node_migrators ORDER BY created_at DESC LIMIT 1")
    const version = res.rows[0].version

    const file = fs.readdirSync(migrationsDir)
      .find((file) => file.startsWith(`${version}_`) && file.endsWith('.sql'))

    if (!file) throw Error(`Migration script version ${version} not found`)
    const migrationPath = join(migrationsDir, file);
    const migrationScripts = fs.readFileSync(migrationPath, 'utf8');

    const sqls = migrationScripts.split('-- +migrator DOWN')[1] || ''
    const sql =  sqls?.split('-- +migrator UP')[0] || ''
    await db.query(sql);

    await db.query("DELETE FROM node_migrators WHERE version = $1", [version])
    console.log(`✓ Migration ${file} reverted`);
  } catch (e) {
    console.error('Migration DOWN failed: ', (e as Error).message);
    process.exit(1);
  }
}

async function migrateReset(db: Pool, migrationsDir: string) {
  try {
    console.log('Reverting database migrations...');
    const res = await db.query("SELECT version FROM node_migrators")
    const versions = res.rows.map((row) => row.version)
    const scripts: string[] = []
    const availableVersions: string[] = []

    const files = fs.readdirSync(migrationsDir)
      .filter((file) => {
        const isVersion =  versions.includes(file.split('_')[0])
        return isVersion && file.endsWith('.sql')
      }).sort().reverse()

    for (const file of files) {
      if (files.includes(file)) {
        scripts.push(file)
        availableVersions.push(file.split('_')[0] as string)
      }
    }

    if (scripts.length !== res.rowCount) {
      const missingVersions = versions.filter((v) => !availableVersions.includes(v))
      throw Error(`Missing version: ${missingVersions}`)
    }

    for (const file of scripts) {
      const migrationPath = join(migrationsDir, file);
      const migrationScripts = fs.readFileSync(migrationPath, 'utf8');

      const sqls = migrationScripts.split('-- +migrator DOWN')[1] || ''
      const sql =  sqls?.split('-- +migrator UP')[0] || ''
      await db.query(sql);

      console.log(`✓ Migration ${file} reverted`);
    }

    await db.query("DELETE FROM node_migrators")
    console.log("Migrations rolled back");
  } catch (e) {
    console.error('Migration DOWN failed: ', (e as Error).message);
    process.exit(1);
  }
}

await runMigrations();