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
import iconTitle from '../assets/icon_title.png'
  
const DRAWER_WIDTH = 240

const menuItems = [
  { label: 'Dashboard', icon: <SpaceDashboard />, path: '/dashboard' },
  { label: 'Drivers', icon: <PeopleIcon />, path: '/dashboard/drivers' },
  { label: 'Announcements', icon: <AssignmentIcon />, path: '/dashboard/announcements' },
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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Sidebar Header */}
      {/* <Box sx={{ p: 2, bgcolor: '#4d5f2b', color: 'white' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          WasteWise
        </Typography>
        <img src={iconTitle} alt="WasteWise Logo" style={{ width: 40, height: 40, marginBottom: 8 }} />
        <Typography variant="caption">Welcome back, Admin!</Typography>
      </Box> */}
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        mt: 2,
      }}>
        <img src={iconTitle} alt="WasteWise Logo" style={{ width: 100, marginBottom: 8 }} />
         <Typography variant="caption">Welcome back, Admin!</Typography>
      </Box>
      {/* Navigation Menu */}
      <List sx={{ flex: 1, pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              sx={{
                '&:hover': {
                  bgcolor: '#4d5f2b',
                  color: 'white',
                },
                '&.active': {
                  bgcolor: '#f3f7cf',
                  borderLeft: '4px solid #35421e',
                  color: '#4d5f2b',
                  fontWeight: 'bold',
                },
                borderRadius: 2,
                mx: 2,
                my: 1,
                paddingLeft: 4,
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


      {/* Logout Button */}
      <Box sx={{ p: 2, }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            bgcolor: '#f3f7cf',
            '&:hover': {
              bgcolor: '#d32f2f',
              color: 'white',
            },
            color: '#000',
            fontWeight: 'bold',
            paddingLeft: 5,
            // justifyContent: 'center',
            // paddingLeft: -20
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
