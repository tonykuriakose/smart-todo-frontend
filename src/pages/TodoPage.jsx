import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTodos, createTodo } from '../api/todos';

export default function TodoPage() {
  const [title, setTitle] = useState('');
  const queryClient = useQueryClient();

  // ✅ Fetch all todos
  const { data: todos, isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: getTodos
  });

  // ✅ Mutation for creating a new todo
  const createTodoMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries(['todos']);
      setTitle('');
    }
  });

  const handleAdd = () => {
    if (title.trim()) {
      createTodoMutation.mutate({
        title,
        status: 'To Do',
        priority: 'Medium',
      });
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Todos
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" gap={2}>
          <TextField
            label="New Task"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Button variant="contained" onClick={handleAdd}>
            Add
          </Button>
        </Box>
      </Paper>

      {isLoading ? (
        <Typography>Loading todos...</Typography>
      ) : (
        <List component={Paper}>
          {todos?.data?.map((todo) => (
            <Box key={todo.id}>
              <ListItem>
                <ListItemText
                  primary={todo.title}
                  secondary={`Status: ${todo.status} | Priority: ${todo.priority}`}
                />
              </ListItem>
              <Divider />
            </Box>
          ))}
        </List>
      )}
    </Container>
  );
}
