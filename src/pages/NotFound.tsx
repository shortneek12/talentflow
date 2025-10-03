// src/pages/NotFound.tsx
import { Box, Button, Typography } from '@mui/material';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        // Adjust height to be full viewport minus the header's height (approx 64px)
        height: 'calc(100vh - 100px)', 
        textAlign: 'center',
        p: 3,
      }}
    >
      <ReportProblemOutlinedIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
      
      <Typography variant="h1" component="h1" fontWeight="bold" color="primary">
        404
      </Typography>
      
      <Typography variant="h4" component="h2" sx={{ mt: 2, mb: 2 }}>
        Page Not Found
      </Typography>
      
      <Typography color="text.secondary" sx={{ maxWidth: '450px', mb: 4 }}>
        Oops! The page you are looking for does not exist. It might have been moved or deleted.
      </Typography>
      
      <Button
        component={Link}
        to="/app" // Link to the main app dashboard
        variant="contained"
        size="large"
      >
        Go Back to Dashboard
      </Button>
    </Box>
  );
}