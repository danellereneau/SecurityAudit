import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Pages - to be created
import Dashboard from './pages/Dashboard';
import Subscriptions from './pages/Subscriptions';
import Analytics from './pages/Analytics';
import Insights from './pages/Insights';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';

// Components
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="insights" element={<Insights />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
