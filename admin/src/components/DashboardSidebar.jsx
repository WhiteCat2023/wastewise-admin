import React from 'react'
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuthService } from '../service/auth/auth.firebase'
import LogoutIcon from '@mui/icons-material/Logout'
import { SpaceDashboard } from '@mui/icons-material'
import PeopleIcon from '@mui/icons-material/People'
import AssignmentIcon from '@mui/icons-material/Assignment'
import SettingsIcon from '@mui/icons-material/Settings'

const DRAWER_WIDTH = 240

const menuItems = [
  { label: 'Dashboard', icon: <SpaceDashboard />, path: '/dashboard' },
  { label: 'Users', icon: <PeopleIcon />, path: '/dashboard/users' },
  { label: 'Reports', icon: <AssignmentIcon />, path: '/dashboard/reports' },
  { label: 'Settings', icon: <SettingsIcon />, path: '/dashboard/settings' },
]

function DashboardSidebar({ sidebarOpen, mobileOpen, onMobileClose }) {
  const navigate = useNavigate()
  const { logout } = useAuthService()

  const handleLogout = () => {
    try {
      logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleNavigation = (path) => {
    navigate(path)
    onMobileClose()
  }

  const drawerContent = (
    <Box sx={{ bgcolor: '#4d5f2b', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Sidebar Header */}
      <Box sx={{ p: 2, bgcolor: '#4d5f2b', color: 'white' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          WasteWise
        </Typography>
        <Typography variant="caption">Admin Panel</Typography>
      </Box>

      {/* Navigation Menu */}
      <List sx={{ flex: 1, pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              sx={{
                '&:hover': {
                  bgcolor: '#f7fbd8',
                },
                '&.active': {
                  bgcolor: '#f3f7cf',
                  borderLeft: '4px solid #4d5f2b',
                  color: '#4d5f2b',
                  fontWeight: 'bold',
                },
                borderRadius: 2,
                m: 1,
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                sx={{
                  fontSize: '0.75rem',
                }}
                primary={item.label}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* Logout Button */}
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 1,
            bgcolor: '#f3f7cf',
            '&:hover': {
              bgcolor: '#d32f2f',
              color: 'white',
            },
            color: '#d32f2f',
            fontWeight: 'bold',
            justifyContent: 'center',
          }}
        >
          <LogoutIcon sx={{ mr: 1 }} />
          Logout
        </ListItemButton>
      </Box>
    </Box>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          width: sidebarOpen ? DRAWER_WIDTH : 60,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: sidebarOpen ? DRAWER_WIDTH : 60,
            boxSizing: 'border-box',
            border: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            transition: 'width 0.3s ease',
            overflowX: 'hidden',
            mt: 'var(--app-bar-height, 0)',
          },
        }}
      >
        {sidebarOpen && drawerContent}
      </Drawer>

      {/* Mobile Sidebar */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        sx={{ display: { xs: 'block', sm: 'none' }, width: DRAWER_WIDTH }}
        ModalProps={{ keepMounted: true }}
      >
        {drawerContent}
      </Drawer>
    </>
  )
}

export default DashboardSidebar
