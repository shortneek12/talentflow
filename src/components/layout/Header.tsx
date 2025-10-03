// src/components/layout/Header.tsx
import { AppBar, Toolbar, IconButton, Box } from "@mui/material";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '@mui/material/styles';
import { useThemeMode } from "@/hooks/useThemeMode";

export function Header() {
  const theme = useTheme();
  const { toggleThemeMode } = useThemeMode();

  return (
    <AppBar position="static" color="transparent" elevation={1}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton sx={{ ml: 1 }} onClick={toggleThemeMode} color="inherit">
          {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}