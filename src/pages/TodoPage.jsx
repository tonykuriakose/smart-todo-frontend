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
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  Grid
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../api/todos';

export default function TodoPage() {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('To Do');
  const [dueDate, setDueDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const queryClient = useQueryClient();

  const { data: todos, isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: getTodos
  });

  const createTodoMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries(['todos']);
      setTitle('');
      setPriority('Medium');
      setStatus('To Do');
      setDueDate('');
    }
  });

  const updateTodoMutation = useMutation({
    mutationFn: ({ id, data }) => updateTodo(id, data),
    onSuccess: () => queryClient.invalidateQueries(['todos'])
  });

  const deleteTodoMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => queryClient.invalidateQueries(['todos'])
  });

  const handleAdd = () => {
    if (title.trim()) {
      createTodoMutation.mutate({
        title,
        status,
        priority,
        dueDate: dueDate || null
      });
    }
  };

  const handleDelete = (id) => {
    deleteTodoMutation.mutate(id);
  };

  const handleStatusToggle = (todo) => {
    const newStatus =
      todo.status === 'To Do'
        ? 'In Progress'
        : todo.status === 'In Progress'
        ? 'Done'
        : 'To Do';
    updateTodoMutation.mutate({ id: todo.id, data: { status: newStatus } });
  };

  const filteredTodos = filterStatus
    ? todos?.data?.filter((todo) => todo.status === filterStatus)
    : todos?.data;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        SmartToDo
      </Typography>

      <Grid container spacing={4}>
        {/* Left Column: Add New Task */}
        <Grid item xs={12} md={5}>
          <Paper elevation={4} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Add New Task
            </Typography>
            <Box display="flex" gap={2} flexDirection="column">
              <TextField
                label="Task Title"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <MenuItem value="To Do">To Do</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Done">Done</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Due Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
              <Button variant="contained" fullWidth onClick={handleAdd}>
                Add Todo
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Right Column: List of Todos */}
        <Grid item xs={12} md={7}>
          <Paper elevation={4} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Your Tasks
            </Typography>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Filter by Status</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="To Do">To Do</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Done">Done</MenuItem>
              </Select>
            </FormControl>

            {isLoading ? (
              <Typography>Loading todos...</Typography>
            ) : (
              <List>
                {filteredTodos?.map((todo) => (
                  <Box key={todo.id}>
                    <ListItem
                      secondaryAction={
                        <>
                          <Button
                            onClick={() => handleStatusToggle(todo)}
                            variant="outlined"
                            size="small"
                            sx={{ mr: 1 }}
                          >
                            {todo.status}
                          </Button>
                          <IconButton onClick={() => handleDelete(todo.id)} color="error">
                            <DeleteIcon />
                          </IconButton>
                        </>
                      }
                    >
                      <ListItemText
                        primary={todo.title}
                        secondary={`Priority: ${todo.priority} | Due: ${todo.dueDate?.slice(0, 10) || '—'}`}
                      />
                    </ListItem>
                    <Divider />
                  </Box>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
