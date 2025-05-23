import { PGlite } from '@electric-sql/pglite';

let db: PGlite | null = null;

export async function initDatabase(): Promise<PGlite> {
  if (!db) {
    db = new PGlite();
    await initSchema(db);
  }
  return db;
}