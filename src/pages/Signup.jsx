import { useState } from "react";
import {Container,TextField,Button,Typography,Box,Paper,} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { signup } from "../api/auth";

export default function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  console.log(formData);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await signup(formData);
      localStorage.setItem("token", res.data.token);
      navigate("/todos");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 3, marginTop: 8 }}>
        <Typography variant="h5" align="center">
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} mt={2}>
        <TextField
            label="Name"
            name="name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            label="Email"
            name="email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            value={formData.password}
            onChange={handleChange}
          />
        
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Sign Up
          </Button>
          <Button fullWidth sx={{ mt: 1 }} onClick={() => navigate("/login")}>
            Already have an account? Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
