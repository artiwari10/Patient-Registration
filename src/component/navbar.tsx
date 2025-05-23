import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Search } from 'lucide-react';



const Navbar: React.FC<> = () => {
  return (
    <nav className="bg-gray-900 border-b border-gray-800 shadow-md">
      <div className="max-w-7xl lg:max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-white text-2xl font-bold tracking-wide hover:text-indigo-400 transition-colors duration-200"
            >
              Patient Management
            </Link>
          </div>
          <div className="flex items-center">
            <Link
              to="/register"
              className="flex items-center ml-4 px-5 py-2 rounded-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:from-indigo-500 hover:to-purple-500 hover:scale-105 transition-all duration-200"
            >
              <UserPlus className="h-6 w-6 text-indigo-200" />
              <span className="ml-2">Patient Registration</span>
            </Link>
            <Link
              to="/query"
              className="flex items-center ml-4 px-5 py-2 rounded-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-700 text-white shadow-lg hover:from-gray-700 hover:to-gray-600 hover:scale-105 transition-all duration-200"
            >
              <Search className="h-6 w-6 text-indigo-200" />
              <span className="ml-2">Query Section</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
