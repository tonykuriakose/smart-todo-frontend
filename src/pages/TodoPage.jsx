import { useState } from "react";
import {Container,Typography,Box,TextField,Button,Paper,Select,MenuItem,InputLabel,FormControl,IconButton,Grid,Chip,ToggleButton,ToggleButtonGroup} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RefreshIcon from "@mui/icons-material/Refresh";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTodos, createTodo, updateTodo, deleteTodo } from "../api/todos";
import { suggestTasks } from "../api/ai";

const MotionBox = motion(Box);
const stickyColors = ["#FFFA91","#FFD59E","#A7F3D0","#C7D2FE","#FDE68A","#FBCFE8"];
const getNoteColor = (index) => stickyColors[index % stickyColors.length];

export default function TodoPage() {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("To Do");
  const [dueDate, setDueDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [aiInput, setAiInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [priorityForAI, setPriorityForAI] = useState("Medium");
  const [dueDateForAI, setDueDateForAI] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  const queryClient = useQueryClient();
  const { data: todos, isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
  });

  const createTodoMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
      toast.success("✅ Task added! Scroll down to see it.");
    },
    onError: () => toast.error("❌ Failed to add todo"),
  });

  const updateTodoMutation = useMutation({
    mutationFn: ({ id, data }) => updateTodo(id, data),
    onSuccess: () => queryClient.invalidateQueries(["todos"]),
  });

  const deleteTodoMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
      toast.success("🗑 Todo deleted");
    },
    onError: () => toast.error("❌ Failed to delete"),
  });

  const handleAdd = () => {
    if (title.trim()) {
      createTodoMutation.mutate({
        title,
        status,
        priority,
        dueDate: dueDate || null,
      });
      setTitle("");
      setPriority("Medium");
      setStatus("To Do");
      setDueDate("");
    }
  };

  const handleDelete = (id) => deleteTodoMutation.mutate(id);

  const handleStatusToggle = (todo) => {
    const next =
      todo.status === "To Do"
        ? "In Progress"
        : todo.status === "In Progress"
        ? "Done"
        : "To Do";
    updateTodoMutation.mutate({ id: todo.id, data: { status: next } });
  };

  const handleAI = async () => {
    if (!aiInput.trim()) return;
    setLoadingAI(true);
    try {
      const res = await suggestTasks(aiInput);
      const parsed = res.data.suggestions
        .split("\n")
        .map((line) => line.replace(/^[-*]\s*/, "").trim())
        .filter(Boolean)
        .slice(0, 2);
      setSuggestions(parsed);
      setAiInput(""); 
    } catch {
      setSuggestions(["⚠️ Failed to get suggestions."]);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleAddSuggestion = (task) => {
    createTodoMutation.mutate({
      title: task,
      status: "To Do",
      priority: priorityForAI,
      dueDate: dueDateForAI || null,
    });
    setAiInput("");
    setSuggestions([]);
    setDueDateForAI("");
  };

  const filteredTodos = filterStatus
    ? todos?.data?.filter((todo) => todo.status === filterStatus)
    : todos?.data;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        SmartToDo
      </Typography>

      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Paper sx={{ p: 3, mb: 3, bgcolor: "#C7D2FE", borderRadius: 2 }}>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              label="Ask AI to create tasks..."
              placeholder='e.g. "Book a movie Avatar on coming Sunday."'
              fullWidth
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
            />

            <Box display="flex" gap={1}>
              <Button
                variant="contained"
                onClick={handleAI}
                disabled={loadingAI}
              >
                {loadingAI ? "Thinking..." : "Suggest"}
              </Button>
              <IconButton
                onClick={handleAI}
                disabled={loadingAI}
                color="primary"
                title="Refresh Suggestions"
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: 2,
                  bgcolor: "#ffffff80",
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Box>
          </Box>

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
              <Grid container spacing={2}>
                {suggestions.map((task, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Paper
                      sx={{
                        p: 2,
                        bgcolor: getNoteColor(index),
                        borderRadius: 2,
                      }}
                    >
                      <Typography>{task}</Typography>
                      <IconButton
                        onClick={() => handleAddSuggestion(task)}
                        color="primary"
                      >
                        <AddCircleIcon />
                      </IconButton>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Paper>
      </motion.div>

      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Paper
          elevation={4}
          sx={{ p: 3, mb: 3, bgcolor: "#FFFA91", borderRadius: 2 }}
        >
          <Typography variant="h6" gutterBottom>
            📝 Add Todo Manually
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
              <Select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
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
      </motion.div>

      <Paper sx={{ p: 3, mt: 4, borderRadius: 2, bgcolor: '#fdf6e3' }}>
        <Typography variant="h6" gutterBottom>🎯 Filter by Status</Typography>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            label="Status"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="To Do">To Do</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Done">Done</MenuItem>
          </Select>
        </FormControl>

        <Grid container spacing={3}>
          {filteredTodos?.map((todo, index) => (
            <Grid item xs={12} sm={6} md={4} key={todo.id}>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Paper
                  elevation={4}
                  sx={{
                    p: 2,
                    minHeight: 160,
                    borderRadius: 2,
                    bgcolor: getNoteColor(index),
                    transform: `rotate(${index % 2 === 0 ? '-1.5deg' : '1.5deg'})`,
                    position: 'relative'
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">{todo.title}</Typography>
                  <Typography variant="body2">Priority: {todo.priority}</Typography>
                  <Typography variant="body2">Due: {todo.dueDate?.slice(0, 10) || '—'}</Typography>
                  <Chip
                    label={todo.status}
                    onClick={() => handleStatusToggle(todo)}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(todo.id)}
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Paper>


      
    </Container>
  );
}
