import React from 'react'
import { Box, Typography, Paper } from '@mui/material'

function Drivers() {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#4d5f2b' }}>
        Drivers
      </Typography>
      <Paper sx={{ p: 3, bgcolor: 'white' }}>
        <Typography variant="body2" sx={{ color: '#999' }}>
          Drivers management page - Coming soon!
        </Typography>
      </Paper>
    </Box>
  )
}

export default Drivers
