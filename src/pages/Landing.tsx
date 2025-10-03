// src/pages/Landing.tsx
import { Button, Typography, Box, Container } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link } from 'react-router-dom';

export function Landing() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(45deg, #100311 30%, #580092 90%)',
        color: '#cd9cec',
        textAlign: 'center',
        p: 3,
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h1" component="h1" fontWeight="bold" gutterBottom>
          TalentFlow
        </Typography>
        <Typography variant="h5" component="p" sx={{ mb: 4, maxWidth: '600px', margin: 'auto' }}>
          A streamlined, front-end-only hiring platform to manage jobs, candidates, and assessments with ease.
        </Typography>
        <Button
          component={Link}
          to="/app"
          variant="contained"
          size="large"
          endIcon={<ArrowForwardIcon />}
          sx={{
            bgcolor: 'secondary.main',
            color: 'primary.main',
            '&:hover': { bgcolor: 'secondary.light' },
            py: 1.5,
            px: 4,
            fontSize: '1.1rem'
          }}
        >
          Get Started
        </Button>
      </Container>
    </Box>
  );
}