// src/theme.ts
import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#580092', // Indigo
    },
    secondary: {
      main: '#cd9cec', // Wisteria
    },
    background: {
      default: '#f4f5f7', // A light grey background
      paper: '#ffffff',
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#cd9cec', // Wisteria
    },
    secondary: {
      main: '#580092', // Indigo
    },
    background: {
      default: '#100311', // Licorice
      paper: '#1E0B1F', // Slightly lighter Licorice
    },
  },
});