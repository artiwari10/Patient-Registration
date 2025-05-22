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
      phone TEXT NOT NULL,
      address TEXT,
      symptoms TEXT,
      medical_record TEXT,
      relative_name TEXT,
      relative_phone TEXT
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
      console.error("Failed to initialize database:", error);
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
    phone,
    address,
    symptoms,
    medical_record,
    relative_name,
    relative_phone,
  } = patientData;
  const result = await database.query(
    `INSERT INTO patients 
      (first_name, middle_name, last_name, age, gender, phone, address, symptoms, medical_record, relative_name, relative_phone) 
     VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING id`,
    [
      first_name,
      middle_name || null,
      last_name,
      age,
      gender,
      phone || null,
      address || null,
      symptoms || null,
      medical_record || null,
      relative_name || null,
      relative_phone || null,
    ]
  );
  return result.rows?.[0];
};

export const getAllPatients = async (): Promise<any[]> => {
  const database = await initDatabase();
  try {
    const result = await database.query(
      "SELECT * FROM patients ORDER BY last_name, first_name"
    );
    return result.rows || [];
  } catch (error) {
    console.error('Error executing getAllPatients query:', error);
    throw error;
  }
};

export const searchPatientsByName = async (
  searchTerm: string
): Promise<any[]> => {
  const database = await initDatabase();
   try {
    const result = await database.query(
      `SELECT * FROM patients
       WHERE first_name ILIKE $1 OR last_name ILIKE $2
       ORDER BY last_name, first_name`,
      [`%${searchTerm}%`, `%${searchTerm}%`]
    );
    return result.rows || [];
   } catch (error) {
      console.error('Error executing searchPatientsByName query:', error);
      throw error;
   }
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