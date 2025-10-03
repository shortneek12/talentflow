// src/components/layout/Layout.tsx
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

const DRAWER_WIDTH = 240;

export function Layout() {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar drawerWidth={DRAWER_WIDTH} />
      <Box
        component="main"
        sx={{ flexGrow: 1, width: `calc(100% - ${DRAWER_WIDTH}px)` }}
      >
        <Header />
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}