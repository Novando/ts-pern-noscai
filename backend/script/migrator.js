const fs = require('fs');
const { join } = require('path');
const { Pool } = require('pg');

async function runMigrations() {
  const action = process.argv[2] || 'up';
  const type = process.argv[3] || 'migration';
  const name = process.argv[4] || '';

  if (!['migration', 'seed'].includes(type)) {
    console.log('Invalid type. Please use "migration" or "seed".');
    process.exit(1);
  }
  if (action === 'new' && type === 'seed' && name === '') {
    console.log('Invalid name. Please use "new seed" following by name.');
    process.exit(1);
  }

  const pg = new Pool({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    password: process.env.PG_PASS,
    user: process.env.PG_USER,
    database: process.env.PG_DB,
  });

  try {
    await pg.query(`CREATE TABLE IF NOT EXISTS node_migrator_${type}s (
      id BIGSERIAL PRIMARY KEY,
      version VARCHAR(255) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW() 
    )`);

    const scriptsDir = join(__dirname, '../db', type === 'migration' ? 'migration' : 'seed');

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
    console.error('Migration failed: ', e.message);
    process.exit(1);
  } finally {
    await pg.end();
    process.exit(0);
  }
}

async function migrateUp(db, scriptsDir, type) {
  try {
    console.log(`Pushing database ${type}s...`);
    const res = await db.query(`SELECT version FROM node_migrator_${type}s`);
    const versions = res.rows.map((row) => row.version);

    const files = fs.readdirSync(scriptsDir)
      .filter((file) => {
        const isVersion = versions.includes(file.split('_')[0]);
        return !isVersion && file.endsWith('.sql');
      })
      .sort();

    for (const file of files) {
      const migrationPath = join(scriptsDir, file);
      const migrationScripts = fs.readFileSync(migrationPath, 'utf8');

      const sqls = migrationScripts.split('-- +migrator UP')[1] || '';
      const sql = sqls.split('-- +migrator DOWN')[0] || '';

      if (sql.trim()) {
        await db.query(sql);
      }

      const version = file.split('_')[0];
      await db.query(
        `INSERT INTO node_migrator_${type}s (version) VALUES ($1)`,
        [version]
      );
      console.log(`✓ ${type} pushed: ${file}`);
    }

    console.log(`All ${type}s pushed successfully!`);
  } catch (e) {
    console.error(`${type} UP failed: `, e.message);
    throw e;
  }
}

async function migrateDown(db, scriptsDir, type) {
  if (type === 'seed') {
    throw new Error("Seeder cannot be reverted. use 'reset' instead.");
  }

  try {
    console.log(`Reverting database ${type}s...`);
    const res = await db.query(`SELECT version FROM node_migrator_${type}s ORDER BY id DESC LIMIT 1`);

    if (res.rows.length === 0) {
      console.log('No migrations to revert.');
      return;
    }

    const version = res.rows[0].version;
    const file = fs.readdirSync(scriptsDir).find(f => f.startsWith(`${version}_`));

    if (!file) {
      throw new Error(`Migration file for version ${version} not found`);
    }

    const migrationPath = join(scriptsDir, file);
    const migrationScripts = fs.readFileSync(migrationPath, 'utf8');
    const sqls = migrationScripts.split('-- +migrator DOWN');

    if (sqls.length > 1) {
      const sql = sqls[1].trim();
      if (sql) {
        await db.query(sql);
      }
    }

    await db.query(`DELETE FROM node_migrator_${type}s WHERE version = $1`, [version]);
    console.log(`✓ ${type} reverted: ${file}`);
    console.log('Migration reverted successfully!');
  } catch (e) {
    console.error('Migration DOWN failed: ', e.message);
    throw e;
  }
}

async function migrateReset(db, scriptsDir, type) {
  try {
    console.log(`Resetting database ${type}s...`);
    const res = await db.query(`SELECT version FROM node_migrator_${type}s ORDER BY id DESC`);

    if (res.rows.length === 0) {
      console.log(`No ${type}s to reset.`);
      return;
    }

    for (const row of res.rows) {
      const file = fs.readdirSync(scriptsDir).find(f => f.startsWith(`${row.version}_`));
      if (!file) continue;

      const migrationPath = join(scriptsDir, file);
      const migrationScripts = fs.readFileSync(migrationPath, 'utf8');
      const sqls = migrationScripts.split('-- +migrator DOWN');

      if (sqls.length > 1) {
        const sql = sqls[1].trim();
        if (sql) {
          await db.query(sql);
        }
      }

      await db.query(`DELETE FROM node_migrator_${type}s WHERE version = $1`, [row.version]);
      console.log(`✓ ${type} reverted: ${file}`);
    }

    console.log(`All ${type}s reset successfully!`);
  } catch (e) {
    console.error(`Reset ${type} failed: `, e.message);
    throw e;
  }
}

function generateMigration(scriptsDir, name, type) {
  if (!fs.existsSync(scriptsDir)) {
    fs.mkdirSync(scriptsDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
  const fileName = `${timestamp}_${name}.sql`;
  const filePath = join(scriptsDir, fileName);

  const content = `-- +migrator Up
-- SQL in this section is executed when the migration is applied


-- +migrator Down
-- SQL in this section is executed when the migration is rolled back
`;

  fs.writeFileSync(filePath, content);
  console.log(`Created new ${type}: ${filePath}`);
}

// Run the migrations
runMigrations().catch(console.error);
