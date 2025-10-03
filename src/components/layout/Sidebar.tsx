// src/components/layout/Sidebar.tsx
import { NavLink } from "react-router-dom";
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';

const navItems = [
  { text: 'Dashboard', path: '/app', icon: <DashboardIcon /> },
  { text: 'Jobs', path: '/app/jobs', icon: <WorkIcon /> },
  { text: 'Candidates', path: '/app/candidates', icon: <PeopleIcon /> },
  { text: 'Assessments', path: '/app/assessments', icon: <AssessmentIcon /> },
];

export function Sidebar({ drawerWidth }: { drawerWidth: number }) {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" component="h1" fontWeight="bold" color="primary">
          TalentFlow
        </Typography>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={NavLink}
              to={item.path}
              end={item.path === '/app'}
              sx={(theme) => ({
                "&.active": {
                  backgroundColor: theme.palette.action.selected,
                }
              })}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}