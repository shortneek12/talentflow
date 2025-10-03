// src/hooks/useThemeMode.ts
import { createContext, useContext } from 'react';

export const ThemeModeContext = createContext({
  toggleThemeMode: () => {},
});

export const useThemeMode = () => useContext(ThemeModeContext);