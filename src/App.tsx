import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DatabaseProvider } from './Database/DatabaseProvider';

function App() {
  return (
    <DatabaseProvider>
      <Router>
        <Routes>
          <Route path="/" element={<div>Home</div>} />
          
          </Route>
        </Routes>
      </Router>
    </DatabaseProvider>
  );
}
export default App;