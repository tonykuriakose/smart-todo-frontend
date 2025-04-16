import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import TodoPage from './pages/TodoPage';
import AIAssistant from './pages/AIAssistant';
import WeeklySummary from './pages/WeeklySummary';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/todos" element={<TodoPage />} />
        <Route path="/ai" element={<AIAssistant />} />
        <Route path="/summary" element={<WeeklySummary />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
