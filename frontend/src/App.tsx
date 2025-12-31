import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Box, Container, Typography, Button, AppBar, Toolbar, Paper } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196F3',
    },
    secondary: {
      main: '#FF9800',
    },
  },
});

function Home() {
  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Typography variant="h2" gutterBottom>
        💰 Subscription Manager
      </Typography>
      <Typography variant="h5" color="text.secondary" paragraph>
        AI-powered subscription tracking and optimization
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Button variant="contained" component={Link} to="/login" sx={{ mr: 2 }}>
          Login
        </Button>
        <Button variant="outlined" component={Link} to="/register">
          Sign Up
        </Button>
      </Box>
      <Paper sx={{ mt: 6, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          ✨ Features:
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <li><Typography>Track all your subscriptions in one place</Typography></li>
          <li><Typography>Get renewal reminders before charges</Typography></li>
          <li><Typography>Analyze spending patterns over time</Typography></li>
          <li><Typography>Discover savings opportunities</Typography></li>
          <li><Typography>Never miss a free trial ending</Typography></li>
        </Box>
      </Paper>
    </Container>
  );
}

function Login() {
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <Typography paragraph>
          Login functionality will be implemented soon...
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          This is a preview deployment. The backend API is not yet connected.
        </Typography>
        <Button variant="contained" component={Link} to="/" sx={{ mt: 2 }}>
          Back to Home
        </Button>
      </Paper>
    </Container>
  );
}

function Register() {
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>
        <Typography paragraph>
          Registration functionality will be implemented soon...
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          This is a preview deployment. The backend API is not yet connected.
        </Typography>
        <Button variant="contained" component={Link} to="/" sx={{ mt: 2 }}>
          Back to Home
        </Button>
      </Paper>
    </Container>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
          <AppBar position="static">
            <Toolbar>
              <Typography
                variant="h6"
                component={Link}
                to="/"
                sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
              >
                Subscription Manager
              </Typography>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
            </Toolbar>
          </AppBar>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
