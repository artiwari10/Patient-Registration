import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './component/Layout';
import PatientRegistration from './component/PatientRegistration';
import PatientQuery from './component/PatientQuery';
import { DatabaseProvider } from './Database/DatabaseProvider';

function App() {
  return (
    <DatabaseProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/register" element={<PatientRegistration />} />
            <Route path="/query" element={<PatientQuery />} />
          </Route>
        </Routes> 
      </Router>
    </DatabaseProvider>
  );
}

export default App;
