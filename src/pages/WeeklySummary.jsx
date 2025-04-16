import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  CircularProgress
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getTodos } from '../api/todos';
import { weeklySummary } from '../api/ai';

export default function WeeklySummary() {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const { data: todos, isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: getTodos,
  });

  useEffect(() => {
    const generateSummary = async () => {
      if (todos?.data?.length) {
        const completedTasks = todos.data.filter((t) => t.status === 'Done');
        setLoading(true);
        try {
          const res = await weeklySummary(completedTasks);
          setSummary(res.data.summary);
        } catch (err) {
          setSummary('Failed to generate summary.');
        } finally {
          setLoading(false);
        }
      }
    };

    generateSummary();
  }, [todos]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Weekly Summary
      </Typography>

      {isLoading || loading ? (
        <CircularProgress />
      ) : (
        <Paper sx={{ p: 3, mt: 2 }}>
          <Typography>{summary || 'No completed tasks to summarize yet.'}</Typography>
        </Paper>
      )}
    </Container>
  );
}
