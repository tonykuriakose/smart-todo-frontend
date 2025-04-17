import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import TodoPage from './pages/TodoPage';
import WeeklySummary from './pages/WeeklySummary';
import NotFound from './pages/NotFound';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route path="/todos"  element={<Layout><TodoPage /></Layout>}/>
        <Route path="/summary" element={<Layout><WeeklySummary /></Layout>}/>
        
        <Route path="*" element={<NotFound />} />
        
      </Routes>
    </Router>
  );
}

export default App;
