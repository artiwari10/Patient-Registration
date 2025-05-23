import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { DatabaseProvider } from './Database/DatabaseProvider'
import PatientRegistration from './component/PatientRegistration'
import PatientQuery from './component/PatientQuery'

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 p-8">
      <h1 className="text-4xl font-extrabold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-600 drop-shadow-lg">
        Patient Records System
      </h1>
      <div className="flex flex-row w-full max-w-6xl gap-10">
        {/* Left side: Register a Patient */}
        <div className="flex-1 bg-white/90 shadow-2xl rounded-2xl p-8 flex flex-col border border-blue-100 hover:shadow-blue-200 transition-shadow duration-300">
          <h2 className="text-2xl font-semibold mb-6 text-center text-blue-700">Register a Patient</h2>
          <PatientRegistration />
        </div>
        {/* Right side: Run Query */}
        <div className="flex-1 bg-white/90 shadow-2xl rounded-2xl p-8 flex flex-col border border-purple-100 hover:shadow-purple-200 transition-shadow duration-300">
          <h2 className="text-2xl font-semibold mb-6 text-center text-purple-700">Run Query</h2>
          <PatientQuery />
        </div>
      </div>
      <footer className="mt-12 text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} Patient Records System
      </footer>
    </div>
  )
}

function App() {
  return (
    <DatabaseProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* You can still keep the individual routes if you want direct links */}
          <Route path="/register" element={<PatientRegistration />} />
          <Route path="/query" element={<PatientQuery />} />
        </Routes>
      </Router>
    </DatabaseProvider>
  )
}

export default App
