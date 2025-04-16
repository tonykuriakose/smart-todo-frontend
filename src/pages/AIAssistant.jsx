import { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { suggestTasks } from '../api/ai';
import { createTodo } from '../api/todos';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';


export default function AIAssistant() {
  const queryClient = useQueryClient();

const addTodoMutation = useMutation({
  mutationFn: createTodo,
  onSuccess: () => queryClient.invalidateQueries(['todos'])
});

const handleAddOne = (task) => {
  addTodoMutation.mutate({
    title: task,
    status: 'To Do',
    priority: 'Medium',
  });
};

  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAI = async () => {
    setLoading(true);
    try {
      const res = await suggestTasks(input);
      const raw = res.data.suggestions;

      // Convert multiline response into task array
      const tasks = raw
        .split('\n')
        .map((line) => line.replace(/^[-*]\s*/, '').trim())
        .filter(Boolean);

      setSuggestions(tasks);
    } catch (err) {
      setSuggestions(['⚠️ Failed to get suggestions.']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        🧠 AI Assistant
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <TextField
          label="What do you need to do?"
          fullWidth
          multiline
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleAI}
          disabled={loading}
        >
          {loading ? 'Thinking...' : 'Suggest Tasks'}
        </Button>
      </Paper>

      {suggestions.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6">AI Suggestions:</Typography>
          <List>
  {suggestions.map((task, index) => (
    <ListItem
      key={index}
      secondaryAction={
        <IconButton onClick={() => handleAddOne(task)} edge="end" color="primary">
          <AddCircleIcon />
        </IconButton>
      }
    >
      <ListItemText primary={task} />
    </ListItem>
  ))}
</List>

        </Paper>
      )}
    </Container>
  );
}
