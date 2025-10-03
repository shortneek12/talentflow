// src/theme.ts
import { createTheme } from '@mui/material/styles';

// TypeScript Module Augmentation for custom theme properties
declare module '@mui/material/styles' {
  interface Theme {
    custom: {
      mainAppGradient: string;
    };
  }
  interface ThemeOptions {
    custom?: {
      mainAppGradient?: string;
    };
  }
}

// Font
const FONT_FAMILY = "'Alan Sans', sans-serif";

// Light Theme
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
      default: '#f4f5f7', // Light grey
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: FONT_FAMILY,
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    body1: { fontWeight: 400 },
  },
  custom: {
    mainAppGradient: 'linear-gradient(180deg, hsl(286, 50%, 95%), #ffffff 50%)',
  },
});

// Dark Theme
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
      paper: '#1E0B1F',
    },
  },
  typography: {
    fontFamily: FONT_FAMILY,
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    body1: { fontWeight: 400 },
  },
  custom: {
    mainAppGradient: `
      radial-gradient(circle at 90% 10%, hsla(271, 100%, 28%, 0.4), transparent 50%),
      radial-gradient(circle at 10% 90%, hsla(286, 74%, 90%, 0.15), transparent 50%),
      #100311
    `,
  },
});
