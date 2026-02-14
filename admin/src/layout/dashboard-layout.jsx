import React, { useState } from 'react'
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Divider,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import LogoutIcon from '@mui/icons-material/Logout'
import { useNavigate, Outlet } from 'react-router-dom'
import { useAuthService } from '../service/auth/auth.firebase'
import DashboardSidebar from '../components/DashboardSidebar'

const DRAWER_WIDTH = 240

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const navigate = useNavigate()
  const { logout, user } = useAuthService()
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    try {
      logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleMobileClose = () => {
    setMobileOpen(false)
  }



  return (
    <Box sx={{ display: 'flex' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { xs: '100%', sm: `calc(100% - ${sidebarOpen ? DRAWER_WIDTH : 0}px)` },
          ml: { xs: 0, sm: sidebarOpen ? `${DRAWER_WIDTH}px` : 0 },
          bgcolor: '#4d5f2b',
          transition: 'all 0.3s ease',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flex: 1 }} />

          {/* User Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar
              sx={{
                bgcolor: '#f7fbd8',
                color: '#4d5f2b',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
              onClick={handleMenuOpen}
            >
              {user?.email?.[0]?.toUpperCase() || 'A'}
            </Avatar>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem disabled>
                <Typography variant="body2">{user?.email}</Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar - Desktop */}
      <DashboardSidebar 
        sidebarOpen={sidebarOpen} 
        mobileOpen={mobileOpen} 
        onMobileClose={handleMobileClose}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          p: 3,
          mt: '64px',
          bgcolor: '#f9fbf5',
          minHeight: '100vh',
          transition: 'margin 0.3s ease',
          ml: { xs: 0, sm: sidebarOpen ? 0 : '-60px' },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}

export default DashboardLayout