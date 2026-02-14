import React, { useState, useEffect } from 'react'
import { Box, Typography, Grid, Tabs, Tab, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { MyMap } from '../../components/map/map'
import { fetchDrivers } from '../../service/driver/firebase'
import { fetchReports, fetchReportsThisWeek } from '../../service/reports/firebase'

function Dashboard() {
  const [drivers, setDrivers] = useState([])
  const [reports, setReports] = useState([])
  const [reportsThisWeek, setReportsThisWeek] = useState([])
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    // Fetch drivers
    const unsubscribeDrivers = fetchDrivers((driversList) => {
      setDrivers(driversList)
    })

    // Fetch all reports
    const unsubscribeReports = fetchReports((reportsList) => {
      setReports(reportsList)
    })

    // Fetch reports this week
    const unsubscribeReportsWeek = fetchReportsThisWeek((reportsWeekList) => {
      setReportsThisWeek(reportsWeekList)
    })

    return () => {
      unsubscribeDrivers()
      unsubscribeReports()
      unsubscribeReportsWeek()
    }
  }, [])

  const stats = [
    { title: 'Total Drivers', value: drivers.length.toString(), color: '#4d5f2b' },
    { title: 'Total Reports', value: reports.length.toString(), color: '#3f4f24' },
    { title: 'Total Garbage Collected per month', value: "52.5 tons", color: '#4d5f2b' },
    { title: 'This Week', value: reportsThisWeek.length.toString(), color: '#3f4f24' },
  ]

  // Get recent items (last 5)
  const recentDrivers = drivers.slice(0, 5)
  const recentReports = reports.slice(0, 5)

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#4d5f2b' }}>
        Dashboard
      </Typography>

      {/* Stats Grid */}
      <Grid container spacing={2} sx={{ mb: 4, width: '100%' }}>
        {stats.map((stat, index) => (
          <Grid size={3}key={index}>
            <Box
              sx={{
                p: 2,
                bgcolor: '#f7fbd8',
                borderRadius: 1,
                borderLeft: `3px solid ${stat.color}`,
              }}
            >
              <Typography variant="caption" sx={{ color: '#666', display: 'block', mb: 0.5 }}>
                {stat.title}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: stat.color }}>
                {stat.value}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#4d5f2b' }}>
        Recent Activity
      </Typography>
      {/* Recent Activity Tabs */}
      <Paper sx={{ bgcolor: '#f7fbd8', mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{
            borderBottom: '2px solid #e0e0e0',
            '& .MuiTab-root': {
              color: '#666',
              '&.Mui-selected': {
                color: '#4d5f2b',
                fontWeight: 'bold',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#4d5f2b',
            },
          }}
        >
          <Tab label="Drivers" />
          <Tab label="Reports" />
        </Tabs>

        {/* Recent Drivers Tab */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            {recentDrivers.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#e8f5e9' }}>
                      <TableCell sx={{ fontWeight: 'bold', color: '#4d5f2b' }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#4d5f2b' }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#4d5f2b' }}>Phone</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#4d5f2b' }}>Vehicle</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#4d5f2b' }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentDrivers.map((driver) => (
                      <TableRow key={driver.id} sx={{ '&:hover': { bgcolor: '#f1f8e9' } }}>
                        <TableCell>{driver.name}</TableCell>
                        <TableCell>{driver.email}</TableCell>
                        <TableCell>{driver.phone}</TableCell>
                        <TableCell>{driver.vehicleNumber}</TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: 'inline-block',
                              px: 1.5,
                              py: 0.5,
                              bgcolor: driver.status === 'active' ? '#c8e6c9' : '#ffcccc',
                              color: driver.status === 'active' ? '#2e7d32' : '#c62828',
                              borderRadius: 0.5,
                              fontSize: '0.85rem',
                              fontWeight: 'bold',
                            }}
                          >
                            {driver.status}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography sx={{ color: '#999', textAlign: 'center', py: 3 }}>
                No drivers found
              </Typography>
            )}
          </Box>
        )}

        {/* Recent Reports Tab */}
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            {recentReports.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#e8f5e9' }}>
                      <TableCell sx={{ fontWeight: 'bold', color: '#4d5f2b' }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#4d5f2b' }}>Description</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#4d5f2b' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#4d5f2b' }}>Created</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentReports.map((report) => (
                      <TableRow key={report.id} sx={{ '&:hover': { bgcolor: '#f1f8e9' } }}>
                        <TableCell sx={{ fontSize: '0.85rem' }}>{report.id.substring(0, 8)}...</TableCell>
                        <TableCell>{report.description || 'N/A'}</TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: 'inline-block',
                              px: 1.5,
                              py: 0.5,
                              bgcolor: '#c8e6c9',
                              color: '#2e7d32',
                              borderRadius: 0.5,
                              fontSize: '0.85rem',
                              fontWeight: 'bold',
                            }}
                          >
                            Active
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.85rem' }}>
                          {report.createdAt
                            ? new Date(report.createdAt.toDate?.() || report.createdAt).toLocaleDateString()
                            : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography sx={{ color: '#999', textAlign: 'center', py: 3 }}>
                No reports found
              </Typography>
            )}
          </Box>
        )}
      </Paper>

      {/* <MyMap />/ */}

    </Box>
  )
}

export default Dashboard
