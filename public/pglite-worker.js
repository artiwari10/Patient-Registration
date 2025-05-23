import { PGlite } from '@electric-sql/pglite';

let db = null;

export async function initDatabase()  {
  if (!db) {
    db = new PGlite();
    await initSchema(db);
  }
  return db;
}
