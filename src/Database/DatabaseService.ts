import { PGliteWorker } from '@electric-sql/pglite/worker';

let db: PGliteWorker | null = null;

const initSchema = async (database: PGliteWorker) => {
  await database.query(`
    CREATE TABLE IF NOT EXISTS patients (
      id SERIAL PRIMARY KEY,
      first_name TEXT NOT NULL,
      middle_name TEXT,
      last_name TEXT NOT NULL,
      age INTEGER NOT NULL,
      gender TEXT NOT NULL,
      number TEXT NOT NULL,
      address TEXT NOT NULL,
      symptoms TEXT NOT NULL,
      previous_medical_record TEXT,
      relative_name TEXT NOT NULL,
      relative_contact TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await database.query(`
    CREATE INDEX IF NOT EXISTS idx_patient_name ON patients (last_name, first_name);
  `);

  console.log("Database schema initialized");
};

export const initDatabase = async (): Promise<PGliteWorker> => {
  if (!db) {
    try {
      const workerInstance = new Worker(new URL('/pglite-worker.js', import.meta.url), {
        type: 'module',
      });
      db = new PGliteWorker(workerInstance);
      await initSchema(db);
    } catch (error) {
      console.log("Failed to initialize database:", error);
      throw error;
    }
  }
  return db;
};

export const registerPatient = async (patientData: any): Promise<any> => {
  const database = await initDatabase();
  const {
    first_name,
    middle_name,
    last_name,
    age,
    gender,
    number,
    address,
    symptoms,
    previous_medical_record,
    relative_name,
    relative_contact,
  } = patientData;

  const result = await database.query(
    `INSERT INTO patients 
      (first_name, middle_name, last_name, age, gender, number, address, symptoms, previous_medical_record, relative_name, relative_contact) 
     VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING id`,
    [
      first_name,
      middle_name || null,
      last_name,
      age,
      gender,
      number,
      address,
      symptoms,
      previous_medical_record || null,
      relative_name,
      relative_contact,
    ]
  );
console.log("Patient registered:", result);
  return result.rows?.[0];
};


export const executeQuery = async (
  sqlQuery: string,
  params: any[] = []
): Promise<any> => {
  try {
    const database = await initDatabase();
    const result = await database.query(sqlQuery, params);
    return { success: true, data: result.rows || [], error: null };
  } catch (error: any) {
    console.error("Query execution error:", error);
    return {
      success: false,
      data: [],
      error: error.message || "An error occurred while executing the query",
    };
  }
};
