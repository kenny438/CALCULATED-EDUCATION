import Database from 'better-sqlite3';

const db = new Database('masterlearn.db');
const columns = db.prepare('PRAGMA table_info(users)').all();
console.log(columns);
