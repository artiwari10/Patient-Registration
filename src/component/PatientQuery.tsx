import React, { useState } from 'react';
import { executeQuery } from '../Database/DatabaseService';
import { useDatabaseContext } from '../Database/DatabaseProvider';
import { Database } from 'lucide-react';

interface QueryResult {
  success: boolean;
  data: any[];
  error: string | null;
}

const PatientQuery: React.FC = () => {
  const { isInitialized } = useDatabaseContext();
  const [sqlQuery, setSqlQuery] = useState<string>('SELECT * FROM patients;');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSqlQuery(e.target.value);
  };

  const executeCustomQuery = async () => {
    if (!sqlQuery.trim()) return;
    setIsExecuting(true);
    try {
      const result = await executeQuery(sqlQuery);
      setQueryResult(result);
    } catch (error: any) {
      setQueryResult({
        success: false,
        data: [],
        error: error.message || 'An error occurred while executing the query',
      });
    } finally {
      setIsExecuting(false);
    }
  };

  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="page-transition">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-indigo-300">Patient Query</h1>
        <p className="mt-2 text-sm text-gray-400">
          Run custom <span className="text-indigo-400 font-semibold">SQL queries</span> against the patient database.
        </p>
        <div className="mt-4 bg-gray-800 border border-gray-700 rounded p-3 text-indigo-200 text-sm text-left">
          <strong>Note:</strong> For basic queries, you can use:
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>
              <code className="bg-gray-700 px-1 py-0.5 rounded">SELECT * FROM patients;</code>
            </li>
            <li>
              <code className="bg-gray-700 px-1 py-0.5 rounded">SELECT first_name, last_name FROM patients WHERE gender = 'male';</code>
            </li>
            <li>
              <code className="bg-gray-700 px-1 py-0.5 rounded">SELECT * FROM patients WHERE age &gt; 30;</code>
            </li>
          </ul>
        </div>
      </header>

      <div className="bg-gray-900 shadow-lg rounded-lg mb-8 border border-gray-800">
        <div className="px-4 py-5 sm:p-6">
          <div className="mb-4">
            <label htmlFor="sqlQuery" className="block text-indigo-300 font-semibold mb-2">
              SQL Query
            </label>
            <textarea
              id="sqlQuery"
              rows={5}
              className="w-full rounded-md bg-gray-800 text-indigo-100 border border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm p-3 transition"
              value={sqlQuery}
              onChange={handleQueryChange}
              placeholder="Enter your SQL query here..."
            ></textarea>
          </div>

          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={executeCustomQuery}
              disabled={isExecuting}
              className="inline-flex items-center px-4 py-2 rounded-md font-semibold bg-gray-800 text-white shadow-lg hover:bg-gray-700 hover:scale-105 transition-all duration-200"
            >
              {isExecuting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </>
              ) : (
                <>
                  Search
                </>
              )}
            </button>
            
          </div>
        </div>
      </div>

      {queryResult && (
        <div className="bg-gray-900 shadow-lg rounded-lg border border-gray-800">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-indigo-200">Query Results</h3>
            </div>

            {!queryResult.success ? (
              <div className="bg-red-900 border-l-4 border-red-700 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-200">
                      {queryResult.error || 'An error occurred while executing the query'}
                    </p>
                  </div>
                </div>
              </div>
            ) : queryResult.data.length === 0 ? (
              <div className="text-center py-10">
                <svg className="mx-auto h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-indigo-200">No results</h3>
                <p className="mt-1 text-sm text-gray-400">Your query did not return any results.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded">
                <table className="min-w-full divide-y divide-gray-800 text-xs">
                  <thead className="bg-gray-800">
                    <tr>
                      {Object.keys(queryResult.data[0]).map((column) => (
                        <th
                          key={column}
                          className="px-2 py-1 text-left font-semibold text-indigo-300 uppercase tracking-wider whitespace-nowrap"
                        >
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {queryResult.data.map((row, rowIndex) => (
                      <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'}>
                        {Object.values(row).map((value: any, colIndex) => (
                          <td
                            key={colIndex}
                            className="px-2 py-1 text-indigo-100 whitespace-nowrap max-w-[120px] overflow-hidden text-ellipsis"
                          >
                            {value === null
                              ? <span className="text-gray-500">null</span>
                              : typeof value === 'object'
                                ? JSON.stringify(value)
                                : String(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          {queryResult.success && queryResult.data.length > 0 && (
            <div className="bg-gray-800 px-4 py-3 sm:px-6 rounded-b-lg">
              <div className="text-sm text-indigo-200">
                Showing {queryResult.data.length} {queryResult.data.length === 1 ? 'result' : 'results'}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PatientQuery;
