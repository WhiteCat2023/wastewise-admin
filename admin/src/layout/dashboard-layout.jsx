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
import DashboardSidebar from '../components/dashboard-sidebar'

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
          // mt: '64px',
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