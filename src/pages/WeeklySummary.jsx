import React from 'react';
import { Container, Typography } from '@mui/material';

export default function WeeklySummary() {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Weekly Summary
      </Typography>
    </Container>
  );
}
