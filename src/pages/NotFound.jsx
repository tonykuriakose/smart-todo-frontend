import React from 'react';
import { Container, Typography, Button, Paper, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fffcea 0%, #fbcfe8 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 5,
            maxWidth: 400,
            bgcolor: '#FFFA91',
            textAlign: 'center',
            borderRadius: 2,
            transform: 'rotate(-2deg)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
          }}
        >
          <Typography variant="h2" fontWeight="bold" color="error" gutterBottom>
            404
          </Typography>
          <Typography variant="h6" gutterBottom>
            Oops! That sticky note flew away...
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            The page you're looking for doesn’t exist.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/todos')}>
            Go Back Home 🏡
          </Button>
        </Paper>
      </motion.div>
    </Box>
  );
}
