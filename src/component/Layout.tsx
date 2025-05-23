import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';

const Layout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-950 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {location.pathname === '/' && (
            <div className="mb-8 p-6 rounded-lg bg-gray-900 shadow text-center">
              <h1 className="text-3xl font-bold text-indigo-400 mb-2">Welcome to Patient Management</h1>
              <p className="text-gray-300 text-lg mb-4">
                Easily <span className="font-semibold text-indigo-300">register new patients</span> and <span className="font-semibold text-indigo-300">query patient records</span> using the navigation above.
              </p>
              <div className="text-indigo-200 text-base text-left max-w-2xl mx-auto mb-2">
                <div className="font-semibold mb-2">Features:</div>
                <ul className="list-disc list-inside text-indigo-100 text-left space-y-1">
                  <li>Register new patients.</li>
                  <li>Query records using raw SQL.</li>
                  <li>Persist patient data across page refreshes.</li>
                  <li>Support usage across multiple tabs (in the same browser) and ensure writes and reads are synchronized.</li>
                </ul>
              </div>
              <div className="mt-6 text-sm text-gray-500">
                Made by <span className="font-semibold text-indigo-300">Anmol Ratan Tiwari</span>
              </div>
            </div>
          )}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
