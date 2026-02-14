import React from 'react'
import { Box, Typography, Paper } from '@mui/material'

function Users() {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#4d5f2b' }}>
        Users
      </Typography>
      <Paper sx={{ p: 3, bgcolor: 'white' }}>
        <Typography variant="body2" sx={{ color: '#999' }}>
          Users management page - Coming soon!
        </Typography>
      </Paper>
    </Box>
  )
}

export default Users
