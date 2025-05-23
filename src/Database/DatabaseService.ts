import { PGliteWorker } from '@electric-sql/pglite/worker';

let db: PGliteWorker | null = null;

/** Initialize your patient table and indexes */
async function initSchema(database: PGliteWorker) {
  try {
    await database.query(`
      CREATE TABLE IF NOT EXISTS patients (
        id SERIAL PRIMARY KEY,
        first_name TEXT NOT NULL,
        middle_name TEXT,
        last_name TEXT NOT NULL,
        age INTEGER NOT NULL,
        gender TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT,
        symptoms TEXT,
        medical_record TEXT,
        relative_name TEXT,
        relative_phone TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await database.query(`
      CREATE INDEX IF NOT EXISTS idx_patient_name
        ON patients (last_name, first_name);
    `);

    console.log('Database schema initialized');
  } catch (err) {
    console.error('Error initializing schema:', err);
    throw err;
  }
}

/** Lazily spin up the worker + schema only once */
export async function initDatabase(): Promise<PGliteWorker> {
  try {
    if (!db) {
      try {
        const workerInstance = new Worker(
          new URL('/pglite-worker.js', import.meta.url),
          { type: 'module' }
        );
        db = new PGliteWorker(workerInstance);
        await initSchema(db);
      } catch (err) {
        console.error('Failed to initialize DB:', err);
        throw err;
      }
    }
    return db;
  } catch (err) {
    console.error('Error in initDatabase:', err);
    throw err;
  }
}

/** Insert one patient and return its new ID */
export async function registerPatient(data: {
  first_name: string;
  middle_name?: string;
  last_name: string;
  age: number;
  gender: string;
  phone: string;
  address?: string;
  symptoms?: string;
  medical_record?: string;
  relative_name?: string;
  relative_phone?: string;
}): Promise<{ id: number }> {
  try {
    const database = await initDatabase();
    const {
      first_name,
      middle_name = null,
      last_name,
      age,
      gender,
      phone,
      address = null,
      symptoms = null,
      medical_record = null,
      relative_name = null,
      relative_phone = null,
    } = data;

    const { rows } = await database.query(
      `INSERT INTO patients 
        (first_name, middle_name, last_name, age, gender,
         phone, address, symptoms, medical_record, relative_name, relative_phone)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING id`,
      [
        first_name,
        middle_name,
        last_name,
        age,
        gender,
        phone,
        address,
        symptoms,
        medical_record,
        relative_name,
        relative_phone,
      ]
    );

    return rows[0];
  } catch (err) {
    console.error('Error registering patient:', err);
    throw err;
  }
}

/** Fetch all patients in insertion order */
export async function getAllPatients(): Promise<any[]> {
  try {
    const database = await initDatabase();
    const { rows } = await database.query(
      `SELECT * FROM patients ORDER BY id`
    );
    return rows;
  } catch (err) {
    console.error('Error fetching all patients:', err);
    throw err;
  }
}

/** Search by first or last name (case-insensitive) */
export async function searchPatientsByName(term: string): Promise<any[]> {
  try {
    const database = await initDatabase();
    const like = `%${term}%`;
    const { rows } = await database.query(
      `SELECT * FROM patients
       WHERE first_name ILIKE $1 OR last_name ILIKE $2
       ORDER BY last_name, first_name`,
      [like, like]
    );
    return rows;
  } catch (err) {
    console.error('Error searching patients by name:', err);
    throw err;
  }
}

/** Run an arbitrary SQL query and return structured result */
export async function executeQuery(
  sql: string,
  params: any[] = []
): Promise<{ success: boolean; data: any[]; error: string | null }> {
  try {
    const database = await initDatabase();
    const { rows } = await database.query(sql, params);
    return { success: true, data: rows, error: null };
  } catch (err: any) {
    console.error('Query execution error:', err);
    return {
      success: false,
      data: [],
      error: err.message || 'Error executing query',
    };
  }
}
