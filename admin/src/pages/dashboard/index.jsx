import React from 'react'
import { Box, Typography, Grid, Paper } from '@mui/material'
import { MyMap } from '../../components/map/map'

function Dashboard() {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#4d5f2b' }}>
        Dashboard
      </Typography>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { title: 'Total Users', value: '1,234', color: '#4d5f2b' },
          { title: 'Active Waste Reports', value: '567', color: '#3f4f24' },
          { title: 'Completed Tasks', value: '892', color: '#4d5f2b' },
          { title: 'This Week', value: '145', color: '#3f4f24' },
        ].map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              sx={{
                p: 2,
                bgcolor: '#f7fbd8',
                borderLeft: `4px solid ${stat.color}`,
                borderRadius: 1,
              }}
            >
              <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                {stat.title}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: stat.color }}>
                {stat.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Recent Activity */}
      <Paper sx={{ p: 3, bgcolor: 'white' }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#4d5f2b' }}>
          Recent Activity
        </Typography>
        <Typography variant="body2" sx={{ color: '#999' }}>
          No recent activity yet. Check back soon!
        </Typography>
      </Paper>

      <MyMap/>
    </Box>
  )
}

export default Dashboard
