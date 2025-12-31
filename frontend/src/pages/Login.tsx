import React from 'react';
import { Typography, Box, Paper } from '@mui/material';

const Login: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h4" gutterBottom align="center">
          Login
        </Typography>
        <Typography variant="body1" align="center">
          Login form implementation coming soon.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
