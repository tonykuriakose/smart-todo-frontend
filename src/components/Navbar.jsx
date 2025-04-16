import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: '#FFFA91', // light yellow background like sticky notes
        boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
        transform: 'rotate(-0.3deg)',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{
            color: '#333',
            cursor: 'pointer',
            fontFamily: 'Comic Sans MS, cursive',
          }}
          onClick={() => navigate('/todos')}
        >
          📝 SmartToDo
        </Typography>

        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            sx={{ bgcolor: '#A7F3D0', color: '#000', fontWeight: 'bold' }}
            onClick={() => navigate('/summary')}
          >
            Weekly Summary
          </Button>
          <Button
            variant="contained"
            sx={{ bgcolor: '#FCA5A5', color: '#000', fontWeight: 'bold' }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

