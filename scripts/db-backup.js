/**
 * Database backup script
 * Dumps the PostgreSQL database (schema + data) to database/backups/.
 * Usage:  npm run db:backup
 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const backupDir = path.join(__dirname, '..', 'database', 'backups');

if (!process.env.DB_NAME) {
  console.error('ERROR: DB_NAME not set. Copy .env.production.example to .env first.');
  process.exit(1);
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const file = path.join(backupDir, `backup-${timestamp}.sql`);

fs.mkdirSync(backupDir, { recursive: true });

const env = { ...process.env, PGPASSWORD: process.env.DB_PASSWORD || '' };

const args = [];
if (process.env.DATABASE_URL) {
  args.push(process.env.DATABASE_URL, '--file=' + file);
} else {
  args.push(
    '--host=' + (process.env.DB_HOST || 'localhost'),
    '--port=' + (process.env.DB_PORT || '5432'),
    '--username=' + (process.env.DB_USER || 'postgres'),
    '--dbname=' + process.env.DB_NAME,
    '--file=' + file
  );
}

const dump = spawn('pg_dump', args, { env, stdio: 'inherit' });

dump.on('close', (code) => {
  if (code === 0) {
    console.log('Backup created: ' + file);
  } else {
    console.error('Backup failed with exit code ' + code + '. Make sure pg_dump is installed and on PATH.');
    process.exit(code);
  }
});