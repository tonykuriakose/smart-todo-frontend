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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../api/todos';
import { suggestTasks } from '../api/ai';

const MotionBox = motion(Box);

export default function TodoPage() {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('To Do');
  const [dueDate, setDueDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [aiInput, setAiInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [priorityForAI, setPriorityForAI] = useState('Medium');
  const [dueDateForAI, setDueDateForAI] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);

  const queryClient = useQueryClient();

  const { data: todos, isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: getTodos
  });


  const createTodoMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries(['todos']);
      toast.success('✅ New todo added!');
    },
    onError: () => {
      toast.error('❌ Failed to add todo');
    }
  });
  

  const updateTodoMutation = useMutation({
    mutationFn: ({ id, data }) => updateTodo(id, data),
    onSuccess: () => queryClient.invalidateQueries(['todos'])
  });

  const deleteTodoMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries(['todos']);
      toast.success('🗑 Todo deleted');
    },
    onError: () => {
      toast.error('❌ Failed to delete');
    }
  });
  

  const handleAdd = () => {
    if (title.trim()) {
      createTodoMutation.mutate({
        title,
        status,
        priority,
        dueDate: dueDate || null
      });
      setTitle('');
      setPriority('Medium');
      setStatus('To Do');
      setDueDate('');
    }
  };

  const handleDelete = (id) => {
    deleteTodoMutation.mutate(id);
  };

  const handleStatusToggle = (todo) => {
    const next =
      todo.status === 'To Do'
        ? 'In Progress'
        : todo.status === 'In Progress'
        ? 'Done'
        : 'To Do';
    updateTodoMutation.mutate({ id: todo.id, data: { status: next } });
  };

  const handleAI = async () => {
    if (!aiInput.trim()) return;
    setLoadingAI(true);
    try {
      const res = await suggestTasks(aiInput);
      const parsed = res.data.suggestions
        .split('\n')
        .map((line) => line.replace(/^[-*]\s*/, '').trim())
        .filter(Boolean)
        .slice(0, 2); // show only top 2
      setSuggestions(parsed);
    } catch {
      setSuggestions(['⚠️ Failed to get suggestions.']);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleAddSuggestion = (task) => {
    createTodoMutation.mutate({
      title: task,
      status: 'To Do',
      priority: priorityForAI,
      dueDate: dueDateForAI || null
    });
  };

  const filteredTodos = filterStatus
    ? todos?.data?.filter((todo) => todo.status === filterStatus)
    : todos?.data;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        SmartToDo
      </Typography>

      {/* 🧠 AI Input Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" gap={2} alignItems="center">
          <TextField
            label="Describe your tasks (e.g. book tickets, write report)"
            fullWidth
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
          />
          <Button variant="contained" onClick={handleAI} disabled={loadingAI}>
            {loadingAI ? 'Thinking...' : 'Suggest'}
          </Button>
        </Box>

        {/* Global AI options */}
        {suggestions.length > 0 && (
          <Box mt={3}>
            <Box display="flex" gap={2} sx={{ mb: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={priorityForAI}
                  onChange={(e) => setPriorityForAI(e.target.value)}
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Due Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={dueDateForAI}
                onChange={(e) => setDueDateForAI(e.target.value)}
                fullWidth
              />
            </Box>

            <Typography variant="h6" gutterBottom>
              AI Suggestions:
            </Typography>
            <List>
              {suggestions.map((task, index) => (
                <MotionBox
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15 }}
                >
                  <ListItem
                    secondaryAction={
                      <IconButton onClick={() => handleAddSuggestion(task)} color="primary">
                        <AddCircleIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText primary={task} />
                  </ListItem>
                  <Divider />
                </MotionBox>
              ))}
            </List>
          </Box>
        )}
      </Paper>

      {/* 📝 Add Todo Manually */}
      <Paper elevation={4} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Add Task</Typography>
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
            type="date"
            label="Due Date"
            InputLabelProps={{ shrink: true }}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <Button variant="contained" onClick={handleAdd}>
            Add Todo
          </Button>
        </Box>
      </Paper>

      {/* 📋 Task List */}
      <Paper elevation={4} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Your Tasks</Typography>
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
                        size="small"
                        variant="outlined"
                        onClick={() => handleStatusToggle(todo)}
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
    </Container>
  );
}
