import fs from 'fs';
import {join} from 'path';
import {Pool} from "pg";
import {envConfig} from "../src/configs/config.config";

type MigrationAction = 'up' | 'down' | 'reset' | 'new'

async function runMigrations() {
  const action = (process.argv[2] || 'up') as MigrationAction
  const type = (process.argv[3] || 'migration')
  const name = process.argv[4] || ''

  if (!['migration', 'seed'].includes(type)) {
    console.log('Invalid type. Please use "migration" or "seed".');
    process.exit(1);
  }
  if (action === 'new' && type === 'seed' && name === '') {
    console.log('Invalid name. Please use "new seed" following by name.');
    process.exit(1);
  }

  try {
    const pg = new Pool({
      host: envConfig.pg.host,
      port: envConfig.pg.port,
      password: envConfig.pg.password,
      user: envConfig.pg.user,
      database: envConfig.pg.database,
    })

    await pg.query(`CREATE TABLE IF NOT EXISTS node_migrator_${type}s (
      id BIGSERIAL PRIMARY KEY,
      version VARCHAR(255) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW() 
    )`);

    // @ts-ignore
    const scriptsDir = join(import.meta.dirname, '../db', type === 'migration' ? 'migration' : 'seed');
    switch (action) {
      case 'up':
        await migrateUp(pg, scriptsDir, type);
        break;
      case 'down':
        await migrateDown(pg, scriptsDir, type);
        break;
      case 'reset':
        await migrateReset(pg, scriptsDir, type);
        break;
      case 'new':
        generateMigration(scriptsDir, name, type);
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

async function migrateUp(db: Pool, scriptsDir: string, type: string) {
  try {
    console.log(`Pushing database ${type}s...`);
    const res = await db.query(`SELECT version FROM node_migrator_${type}s`)
    const versions = res.rows.map((row) => row.version)
    const scripts: string[] = []
    const availableVersions: string[] = []

    const files = fs.readdirSync(scriptsDir)
      .filter((file) => {
        const isVersion =  versions.includes(file.split('_')[0])
        return !isVersion && file.endsWith('.sql')
      }).sort()

    for (const file of files) {
      const migrationPath = join(scriptsDir, file);
      const migrationScripts = fs.readFileSync(migrationPath, 'utf8');

      const sqls = migrationScripts.split('-- +migrator UP')[1] || ''
      const sql =  sqls?.split('-- +migrator DOWN')[0] || ''
      await db.query(sql);

      const version = file.split('_')[0]
      await db.query(`INSERT INTO node_migrator_${type}s (version) VALUES ($1)`, [version])
      console.log(`✓ Migration pushed: ${file}`);
    }

    console.log(`All ${type}s pushed successfully!`);
  } catch (e) {
    console.error('Migration UP failed: ', (e as Error).message);
    process.exit(1);
  }
}

async function migrateDown(db: Pool, scriptsDir: string, type: string) {
  if (type === 'seed') {
    throw new Error("Seeder cannot be reverted. use 'reset' instead.")
  }
  try {
    console.log(`Rolling back database ${type}s...`);
    const res = await db.query(`SELECT version FROM node_migrator_${type}s ORDER BY created_at DESC LIMIT 1`)
    const version = res.rows[0].version

    const file = fs.readdirSync(scriptsDir)
      .find((file) => file.startsWith(`${version}_`) && file.endsWith('.sql'))

    if (!file) throw Error(`Migration script version ${version} not found`)
    const migrationPath = join(scriptsDir, file);
    const migrationScripts = fs.readFileSync(migrationPath, 'utf8');

    const sqls = migrationScripts.split('-- +migrator DOWN')[1] || ''
    const sql =  sqls?.split('-- +migrator UP')[0] || ''
    await db.query(sql);

    await db.query(`DELETE FROM node_migrator_${type}s WHERE version = $1`, [version])
    console.log(`✓ Migration reverted: ${file}`);
  } catch (e) {
    console.error('Migration DOWN failed: ', (e as Error).message);
    process.exit(1);
  }
}

async function migrateReset(db: Pool, scriptsDir: string, type: string) {
  try {
    console.log(`Reverting database ${type}s...`);
    if (type === 'seed') {
      await db.query("DROP TABLE IF EXISTS node_migrator_seeds");
      console.log("✓ Seed cleaned");
      return;
    }
    const res = await db.query(`SELECT version FROM node_migrator_${type}s`)
    const versions = res.rows.map((row) => row.version)
    const scripts: string[] = []
    const availableVersions: string[] = []

    const files = fs.readdirSync(scriptsDir)
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
      const migrationPath = join(scriptsDir, file);
      const migrationScripts = fs.readFileSync(migrationPath, 'utf8');

      const sqls = migrationScripts.split('-- +migrator DOWN')[1] || ''
      const sql =  sqls?.split('-- +migrator UP')[0] || ''
      await db.query(sql);

      console.log(`✓ Migration ${file} reverted`);
    }

    await db.query(`DELETE FROM node_migrator_${type}s`)
    await db.query("DROP TABLE IF EXISTS node_migrator_seeds");
    console.log("Migrations rolled back");
  } catch (e) {
    console.error('Migration DOWN failed: ', (e as Error).message);
    process.exit(1);
  }
}

function generateMigration(scriptsDir: string, name: string, type: string) {
  const timestamp = new Date().toISOString().replace(/\..+/, "").replace(/[^0-9]/g, "")
  const migrationPath = join(scriptsDir, `${timestamp}_${name}.sql`);

  if (!fs.existsSync(scriptsDir)) {
    fs.mkdirSync(scriptsDir, { recursive: true });
  }

  const migrationScripts = `-- +migrator UP
-- +migrator statement BEGIN

-- +migrator statement END


-- +migrator DOWN
-- +migrator statement BEGIN

-- +migrator statement END
`
  fs.writeFileSync(migrationPath, migrationScripts);

  console.log(`✓ ${type} created: ${timestamp}_${name}.sql`);
}

await runMigrations();