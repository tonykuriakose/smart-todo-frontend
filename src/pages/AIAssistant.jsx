import { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { suggestTasks } from '../api/ai';

export default function AIAssistant() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const mutation = useMutation({
    mutationFn: suggestTasks,
    onSuccess: (res) => {
      setResponse(res.data.suggestions);
    },
    onError: (err) => {
      setResponse('⚠️ Failed to get suggestions: ' + (err.response?.data?.error || 'Unknown error'));
    }
  });

  const handleSubmit = () => {
    if (input.trim()) {
      mutation.mutate(input);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        🧠 AI Task Assistant
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
          onClick={handleSubmit}
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? 'Thinking...' : 'Suggest Tasks'}
        </Button>
      </Paper>

      {response && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6">AI Suggestions:</Typography>
          <pre style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>{response}</pre>
        </Paper>
      )}
    </Container>
  );
}
