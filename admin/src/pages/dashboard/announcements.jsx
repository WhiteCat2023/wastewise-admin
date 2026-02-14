import React from 'react'
import { Box, Typography, Paper } from '@mui/material'

function Announcements() {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#4d5f2b' }}>
        Announcement
      </Typography>
      <Paper sx={{ p: 3, bgcolor: 'white' }}>
        <Typography variant="body2" sx={{ color: '#999' }}>
          Announcement management page - Coming soon!
        </Typography>
      </Paper>
    </Box>
  )
}

export default Announcements
