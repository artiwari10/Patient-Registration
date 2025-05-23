import React, { createContext, useContext, useEffect, useState } from 'react';
import { initDatabase } from './DatabaseService';

type DatabaseContextType = {
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
};

// Create a context with default fallback values
const DatabaseContext = createContext<DatabaseContextType>({
  isLoading: true,
  isInitialized: false,
  error: null,
});

// Hook to access the context
export const useDatabaseContext = () => useContext(DatabaseContext);

// Provider component
export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        try {
          await initDatabase();
          setIsInitialized(true);
        } catch (err) {
          console.error('Database init failed:', err);
          setError('Database initialization failed. Please refresh the page.');
        }
      } catch (outerErr) {
        console.error('Unexpected error during DB init:', outerErr);
        setError('Unexpected error during database initialization.');
      } finally {
        setIsLoading(false);
      }
    };
    initialize();
  }, []);

  return (
    <DatabaseContext.Provider value={{ isLoading, isInitialized, error }}>
      {children}
    </DatabaseContext.Provider>
  );
};
