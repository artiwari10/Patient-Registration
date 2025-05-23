// src/components/PatientQuery.tsx
import React, { useState } from 'react';
import { executeQuery } from '../Database/DatabaseService';      // ← your service path
import { useDatabaseContext } from '../Database/DatabaseProvider';  // ← your context path
import { Database, Clipboard, Copy, Download } from 'lucide-react';

interface QueryResult {
  success: boolean;
  data: any[];
  error: string | null;
}

const PatientQuery: React.FC = () => {
  const { isInitialized } = useDatabaseContext();
  const [sqlQuery, setSqlQuery] = useState<string>(
    'SELECT * FROM patients LIMIT 10'
  );
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

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

  const handleLoadExample = (example: string) => {
    setSqlQuery(example);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const downloadResults = () => {
    if (!queryResult?.data?.length) return;
    const jsonStr = JSON.stringify(queryResult.data, null, 2);
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(jsonStr);
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = 'patient_query_results.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="page-transition">
      {/* Custom table styles */}
      <style>{`
        .table-container {
          overflow-x: auto;
          border-radius: 0.5rem;
          box-shadow: 0 2px 8px rgba(80, 80, 160, 0.07);
          margin-top: 1rem;
        }
        .data-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.97rem;
          background: white;
        }
        .data-table th, .data-table td {
          padding: 0.6rem 1rem;
          border-bottom: 1px solid #e5e7eb;
          text-align: left;
        }
        .data-table th {
          background: #f3f4f6;
          font-weight: 600;
          color: #4f46e5;
          letter-spacing: 0.02em;
        }
        .data-table tr:last-child td {
          border-bottom: none;
        }
        .data-table tr:hover td {
          background: #f0f9ff;
        }
      `}</style>

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Patient Query</h1>
        <p className="mt-2 text-sm text-gray-600">
          Run custom SQL queries against the patient database
        </p>
      </header>

      {/* Query Input Panel */}
      <div className="bg-white shadow-lg overflow-hidden sm:rounded-lg mb-8 border border-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <label
            htmlFor="sqlQuery"
            className="form-label font-semibold text-gray-700 mb-2 block"
          >
            SQL Query
          </label>
          <textarea
            id="sqlQuery"
            rows={5}
            className="form-input font-mono text-sm w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 transition"
            value={sqlQuery}
            onChange={handleQueryChange}
            placeholder="Enter your SQL query here..."
          />

          <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
            <div className="flex flex-wrap gap-2">
              {[
                {
                  label: 'Basic query',
                  example: 'SELECT * FROM patients ORDER BY last_name LIMIT 10',
                },
                {
                  label: 'Filter by name',
                  example:
                    "SELECT * FROM patients WHERE last_name LIKE 'S%' ORDER BY last_name",
                },
                {
                  label: 'Statistics',
                  example:
                    'SELECT gender, COUNT(*) as count FROM patients GROUP BY gender',
                },
              ].map(({ label, example }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleLoadExample(example)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition"
                >
                  <Clipboard className="h-4 w-4 mr-1" />
                  {label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={executeCustomQuery}
              disabled={isExecuting}
              className="btn btn-primary px-4 py-2 rounded-md shadow font-semibold text-white bg-blue-600 hover:bg-blue-700 transition"
            >
              {isExecuting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Executing...
                </span>
              ) : (
                <span className="flex items-center">
                  <Database className="h-4 w-4 mr-1" /> Run Query
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Query Results */}
      {queryResult && (
        <div className="bg-white shadow-lg overflow-hidden sm:rounded-lg border border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Query Results</h3>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(JSON.stringify(queryResult.data, null, 2))
                  }
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition"
                  disabled={!queryResult.success || !queryResult.data.length}
                >
                  {copied ? (
                    <span className="flex items-center">
                      <svg
                        className="h-4 w-4 mr-1 text-success-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Copied!
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Copy className="h-4 w-4 mr-1" /> Copy JSON
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={downloadResults}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition"
                  disabled={!queryResult.success || !queryResult.data.length}
                >
                  <Download className="h-4 w-4 mr-1" /> Download JSON
                </button>
              </div>
            </div>

            {queryResult.success ? (
              queryResult.data.length ? (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        {Object.keys(queryResult.data[0]).map((col) => (
                          <th key={col}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {queryResult.data.map((row, i) => (
                        <tr
                          key={i}
                          className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                        >
                          {Object.values(row).map((v, j) => (
                            <td key={j}>
                              {v === null
                                ? <span className="text-gray-400">null</span>
                                : typeof v === 'object'
                                  ? JSON.stringify(v)
                                  : String(v)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No results</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Your query did not return any results.
                  </p>
                </div>
              )
            ) : (
              <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
                <div className="flex items-start">
                  <svg
                    className="h-5 w-5 text-red-600 mr-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 10-16 0 8 8 0 0016 0zm-1-9v4a1 1 0 002 0V9a1 1 0 00-2 0zm1-3a1 1 0 100 2 1 1 0 000-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-red-700">
                    {queryResult.error}
                  </p>
                </div>
              </div>
            )}

            {queryResult.success && queryResult.data.length > 0 && (
              <div className="bg-gray-50 px-4 py-3 sm:px-6 rounded-b">
                <p className="text-sm text-gray-500">
                  Showing {queryResult.data.length}{' '}
                  {queryResult.data.length === 1 ? 'result' : 'results'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientQuery;
