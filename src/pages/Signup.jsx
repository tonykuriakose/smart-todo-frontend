import { useState } from 'react';
import {Container,TextField,Button,Typography,Box,Paper} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signup } from '../api/auth';
import { motion } from 'framer-motion';

export default function Signup() {
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await signup(formData);
      localStorage.setItem('token', res.data.token);
      navigate('/todos');
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0ffe4 0%, #e9e9ff 100%)',

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            maxWidth: 400,
            bgcolor: '#FDE68B',
            borderRadius: 3,
            transform: 'rotate(-1deg)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Typography variant="h4" align="center" gutterBottom fontWeight="bold" color="text.primary">
            ✨ Sign Up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} mt={3} display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Name"
              name="name"
              fullWidth
              value={formData.name}
              onChange={handleChange}
              required
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              required
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              placeholder="Minimum 6 characters"
              fullWidth
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Create Account
            </Button>
            <Button fullWidth sx={{ mt: 1 }} onClick={() => navigate('/login')}>
              Already have an account? Login
            </Button>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
}
