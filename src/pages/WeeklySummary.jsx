import React, { useEffect, useState } from 'react';
import {Container,Typography,Paper,CircularProgress, List,ListItem,ListItemText,Divider,Chip,Box} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getTodos } from '../api/todos';
import { weeklySummary } from '../api/ai';

export default function WeeklySummary() {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [weekTasks, setWeekTasks] = useState([]);

  const { data: todos, isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: getTodos,
  });

  useEffect(() => {
    const generateSummary = async () => {
      if (todos?.data?.length) {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const filtered = todos.data.filter((t) => {
          if (!t.createdAt) return false;
          const taskDate = new Date(t.createdAt);
          return taskDate >= startOfWeek && taskDate <= endOfWeek;
        });

        setWeekTasks(filtered);
        setLoading(true);
        try {
          const res = await weeklySummary({ completedTasks: filtered });
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'To Do': return 'primary';
      case 'In Progress': return 'warning';
      case 'Done': return 'success';
      default: return 'primary';
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        📅 Weekly Summary
      </Typography>

      {isLoading || loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Paper sx={{ p: 4, mt: 2, mb: 4, bgcolor: '#FFF7AE', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              🧠 Summary
            </Typography>
            <Typography>
              {summary || 'No tasks found for this week.'}
            </Typography>
          </Paper>

          {weekTasks.length > 0 && (
            <Paper sx={{ p: 4, bgcolor: '#C7D2FE', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                📝 Tasks Created This Week
              </Typography>
              <List>
                {weekTasks.map((task) => (
                  <React.Fragment key={task.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" fontWeight="bold">
                            {task.title}
                          </Typography>
                        }
                        secondary={
                          <Box mt={1}>
                            <Typography variant="body2" sx={{ display: 'inline', mr: 2 }}>
                              📌 Priority: <strong>{task.priority}</strong>
                            </Typography>
                            <Typography variant="body2" sx={{ display: 'inline', mr: 2 }}>
                              📅 Due: <strong>{task.dueDate?.slice(0, 10) || '—'}</strong>
                            </Typography>
                            <Chip
                              label={task.status}
                              size="small"
                              color={getStatusColor(task.status)}
                              sx={{ mt: 1 }}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          )}
        </>
      )}
    </Container>
  );
}
