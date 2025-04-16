import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" onClick={() => navigate('/todos')} sx={{ cursor: 'pointer' }}>
          SmartToDo
        </Typography>
        <div>
          <Button color="inherit" onClick={() => navigate('/summary')}>Weekly Summary</Button>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </div>
      </Toolbar>
    </AppBar>
  );
}
