// src/pages/Landing.tsx
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link } from 'react-router-dom';

// Icons for features
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';

// MUI keyframes for animations
import { keyframes } from '@mui/system';

// Floating animation
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

// Fade-in animation
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Reusable AnimatedCard
const AnimatedCard = ({ icon, sx }: { icon: React.ReactNode; sx?: any }) => (
  <Paper
    elevation={6}
    sx={{
      p: 2,
      borderRadius: '12px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'primary.main',
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      position: 'absolute',
      ...sx,
    }}
  >
    {icon}
  </Paper>
);

export function Landing() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        minHeight: '100vh',
        overflow: 'hidden',
        position: 'relative',
        background: `
          radial-gradient(circle at 90% 30%, hsla(271, 100%, 28%, 0.5), transparent 40%),
          radial-gradient(circle at 10% 80%, hsla(286, 74%, 90%, 0.2), transparent 50%),
          linear-gradient(45deg, #100311 30%, #580092 90%)
        `,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 4,
            alignItems: 'center',
          }}
        >
          {/* Left Column: Text */}
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography
              variant="h1"
              component="h1"
              fontWeight="800"
              sx={{
                color: 'white',
                animation: `${fadeIn} 1s ease-out`,
              }}
            >
              TalentFlow
            </Typography>

            <Typography
              variant="h5"
              component="p"
              sx={{
                my: 3,
                color: 'secondary.main',
                maxWidth: '500px',
                mx: { xs: 'auto', md: 0 },
                animation: `${fadeIn} 1.2s ease-out`,
              }}
            >
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
                '&:hover': { 
                  bgcolor: 'white',
                  boxShadow: '0 0 20px #cd9cec',
                },
                py: 1.5,
                px: 4,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                animation: `${fadeIn} 1.4s ease-out`,
              }}
            >
              Get Started
            </Button>
          </Box>

          {/* Right Column: Animated Icons */}
          <Box
            sx={{
              position: 'relative',
              height: { xs: '300px', md: '500px' },
              display: { xs: 'none', md: 'block' },
            }}
          >
            <AnimatedCard
              icon={<WorkIcon fontSize="large" />}
              sx={{ top: '10%', left: '20%', animation: `${float} 6s ease-in-out infinite` }}
            />
            <AnimatedCard
              icon={<PeopleIcon sx={{ fontSize: '3rem' }} />}
              sx={{ top: '40%', left: '60%', animation: `${float} 7s ease-in-out infinite 1s` }}
            />
            <AnimatedCard
              icon={<AssessmentIcon fontSize="large" />}
              sx={{ top: '70%', left: '30%', animation: `${float} 5s ease-in-out infinite 0.5s` }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
