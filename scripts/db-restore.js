/**
 * Database restore script
 * Restores a pg_dump file into the configured database.
 * Usage:  npm run db:restore -- path/to/backup.sql
 */
const { spawn } = require('child_process');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const fileArg = process.argv[2];
const file = path.resolve(fileArg || '');

if (!fileArg || !require('fs').existsSync(file)) {
  console.error('Usage: npm run db:restore -- <backup-file.sql>');
  if (fileArg) console.error('File not found: ' + file);
  process.exit(1);
}

const env = { ...process.env, PGPASSWORD: process.env.DB_PASSWORD || '' };

const args = [];
if (process.env.DATABASE_URL) {
  args.push(process.env.DATABASE_URL);
} else {
  args.push(
    '--host=' + (process.env.DB_HOST || 'localhost'),
    '--port=' + (process.env.DB_PORT || '5432'),
    '--username=' + (process.env.DB_USER || 'postgres'),
    '--dbname=' + process.env.DB_NAME
  );
}
args.push('-f', file);

const restore = spawn('psql', args, { env, stdio: 'inherit' });

restore.on('close', (code) => {
  if (code === 0) {
    console.log('Database restored from: ' + file);
  } else {
    console.error('Restore failed with exit code ' + code + '. Make sure psql is installed and on PATH.');
    process.exit(code);
  }
});