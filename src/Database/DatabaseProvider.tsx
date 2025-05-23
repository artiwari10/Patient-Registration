import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { initDatabase } from './DatabaseService';

interface IDatabaseContext {
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

const DatabaseContext = createContext<IDatabaseContext>({
  isLoading: true,
  isInitialized: false,
  error: null,
});

export const useDatabaseContext = () => useContext(DatabaseContext);

type DatabaseProviderProps = {
  children: ReactNode;
};

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        await initDatabase();
        if (isMounted) {
          setIsInitialized(true);
          setError(null);
        }
      } catch (e) {
        if (isMounted) {
          setError('Database initialization failed. Please try again.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <DatabaseContext.Provider value={{ isLoading, isInitialized, error }}>
      {children}
    </DatabaseContext.Provider>
  );
};
