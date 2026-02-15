import React, { useState } from 'react'
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  Chip,
} from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'

// Seeded notification data
const SAMPLE_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Schedule Reminder',
    message: 'Pickup schedule for District 5 starting at 08:00 AM',
    timestamp: 'Today at 10:30 AM',
    type: 'schedule',
    read: false,
  },
  {
    id: 2,
    title: 'Driver Status Update',
    message: 'Driver John Doe marked as "On Leave"',
    timestamp: 'Today at 09:15 AM',
    type: 'driver',
    read: false,
  },
  {
    id: 3,
    title: 'New Report Submitted',
    message: 'Waste report submitted for location: Main Street',
    timestamp: '2 hours ago',
    type: 'report',
    read: true,
  },
  {
    id: 4,
    title: 'Announcement Published',
    message: 'New announcement: "Schedule maintenance for all vehicles"',
    timestamp: '5 hours ago',
    type: 'announcement',
    read: true,
  },
  {
    id: 5,
    title: 'System Alert',
    message: 'Database backup completed successfully',
    timestamp: 'Yesterday at 11:59 PM',
    type: 'system',
    read: true,
  },
]

function NotificationDropdown() {
  const [anchorEl, setAnchorEl] = useState(null)
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS)

  const open = Boolean(anchorEl)
  const unreadCount = notifications.filter((n) => !n.read).length

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMarkAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const getTypeColor = (type) => {
    const colors = {
      schedule: '#2196F3',
      driver: '#FF9800',
      report: '#4CAF50',
      announcement: '#9C27B0',
      system: '#757575',
    }
    return colors[type] || '#757575'
  }

  const getTypeLabel = (type) => {
    const labels = {
      schedule: 'Schedule',
      driver: 'Driver',
      report: 'Report',
      announcement: 'Announcement',
      system: 'System',
    }
    return labels[type] || 'Notification'
  }

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{ color: '#4d5f2b' }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              width: '400px',
              maxHeight: '500px',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            },
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4d5f2b' }}>
            Notifications
          </Typography>
        </Box>
        <Divider />

        {notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#999' }}>
              No notifications yet
            </Typography>
          </Box>
        ) : (
          <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
            {notifications.map((notification) => (
              <MenuItem
                key={notification.id}
                onClick={() => handleMarkAsRead(notification.id)}
                sx={{
                  p: 2,
                  bgcolor: notification.read ? 'transparent' : '#f7fbd8',
                  borderBottom: '1px solid #f0f0f0',
                  '&:hover': {
                    bgcolor: '#fafef5',
                  },
                  display: 'block',
                  cursor: 'pointer',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: notification.read ? 500 : 600,
                        color: '#333',
                      }}
                    >
                      {notification.title}
                    </Typography>
                  </Box>
                  <Chip
                    label={getTypeLabel(notification.type)}
                    size="small"
                    sx={{
                      bgcolor: getTypeColor(notification.type),
                      color: 'white',
                      fontWeight: 500,
                      fontSize: '0.7rem',
                      height: '20px',
                    }}
                  />
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    color: '#666',
                    fontSize: '0.85rem',
                    mb: 0.5,
                    lineHeight: 1.4,
                  }}
                >
                  {notification.message}
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    color: '#999',
                    fontSize: '0.75rem',
                  }}
                >
                  {notification.timestamp}
                </Typography>

                {!notification.read && (
                  <Box
                    sx={{
                      mt: 0.5,
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      bgcolor: '#4d5f2b',
                    }}
                  />
                )}
              </MenuItem>
            ))}
          </Box>
        )}
      </Menu>
    </>
  )
}

export default NotificationDropdown
