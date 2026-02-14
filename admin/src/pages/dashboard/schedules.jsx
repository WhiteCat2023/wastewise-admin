import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Snackbar,
  Alert,
  Chip,
  TextField,
  Pagination,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search'
import ScheduleModal from '../../components/modal/schedule-modal'
import ConfirmationDialog from '../../components/dialog/ConfirmationDialog'
import { fetchSchedules, deleteSchedule } from '../../service/schedule/firebase'

function Schedules() {
  const [modalOpen, setModalOpen] = useState(false)
  const [schedules, setSchedules] = useState([])
  const [editingSchedule, setEditingSchedule] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  })
  const itemsPerPage = 5

  const handleOpen = () => {
    setEditingSchedule(null)
    setModalOpen(true)
  }

  const handleClose = () => {
    setModalOpen(false)
    setEditingSchedule(null)
  }

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule)
    setModalOpen(true)
  }

  const handleDeleteClick = (schedule) => {
    setEditingSchedule(schedule)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!editingSchedule) return
    setDeleteLoading(true)
    try {
      await deleteSchedule(editingSchedule.id)
      setSnackbar({
        open: true,
        message: 'Schedule deleted successfully.',
        severity: 'success',
      })
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error deleting schedule: ' + error.message,
        severity: 'error',
      })
    } finally {
      setDeleteLoading(false)
      setDeleteDialogOpen(false)
      setEditingSchedule(null)
    }
  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbar((prev) => ({ ...prev, open: false }))
  }

  useEffect(() => {
    const unsubscribe = fetchSchedules(setSchedules)
    return () => unsubscribe?.()
  }, [])

  const filteredSchedules = schedules.filter((schedule) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      schedule.pickupDate.toLowerCase().includes(searchLower) ||
      schedule.route.toLowerCase().includes(searchLower) ||
      schedule.status.toLowerCase().includes(searchLower) ||
      (schedule.assignedDrivers &&
        schedule.assignedDrivers.some((driver) =>
          driver.name.toLowerCase().includes(searchLower)
        ))
    )
  })

  const totalPages = Math.ceil(filteredSchedules.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedSchedules = filteredSchedules.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const getStatusColor = (status) => {
    const colors = {
      scheduled: '#2196F3',
      'in-progress': '#FF9800',
      completed: '#4CAF50',
      cancelled: '#9E9E9E',
    }
    return colors[status] || '#4d5f2b'
  }

  const getStatusLabel = (status) => {
    const labels = {
      scheduled: 'Scheduled',
      'in-progress': 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled',
    }
    return labels[status] || status
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4d5f2b' }}>
          Schedules
        </Typography>
        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{
            bgcolor: '#4d5f2b',
            '&:hover': { bgcolor: '#3f4f24' },
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 'bold',
          }}
        >
          <AddIcon sx={{ mr: 1 }} />
          Create Schedule
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          placeholder="Search by date, route, status, or driver name..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          fullWidth
          size="small"
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: '#4d5f2b', fontSize: '20px' }} />,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'white',
              borderRadius: 1,
              '& fieldset': {
                borderColor: '#e0e0e0',
              },
              '&:hover fieldset': {
                borderColor: '#4d5f2b',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#4d5f2b',
                borderWidth: 1,
              },
            },
            '& .MuiOutlinedInput-input': {
              py: 1,
              fontSize: '0.95rem',
            },
          }}
        />
      </Box>

      {schedules.length === 0 ? (
        <Paper sx={{ p: 4, bgcolor: '#f7fbd8', textAlign: 'center' }}>
          <Typography variant="body1" sx={{ color: '#666' }}>
            No schedules yet. Click "Create Schedule" to add one!
          </Typography>
        </Paper>
      ) : filteredSchedules.length === 0 ? (
        <Paper sx={{ p: 4, bgcolor: '#f7fbd8', textAlign: 'center' }}>
          <Typography variant="body1" sx={{ color: '#666' }}>
            No schedules match your search. Try a different query!
          </Typography>
        </Paper>
      ) : (
        <TableContainer sx={{ bgcolor: 'white', borderRadius: 1 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f7fbd8', borderBottom: '2px solid #4d5f2b' }}>
                <TableCell sx={{ fontWeight: 600, color: '#3f4f24', fontSize: '0.9rem' }}>
                  Pickup Date
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#3f4f24', fontSize: '0.9rem' }}>
                  Time
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#3f4f24', fontSize: '0.9rem' }}>
                  Route
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#3f4f24', fontSize: '0.9rem' }}>
                  Assigned Drivers
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#3f4f24', fontSize: '0.9rem' }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#3f4f24', fontSize: '0.9rem' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedSchedules.map((schedule) => (
                <TableRow
                  key={schedule.id}
                  sx={{
                    borderBottom: '1px solid #f0f0f0',
                    '&:hover': { bgcolor: '#fafef5' },
                  }}
                >
                  <TableCell sx={{ fontSize: '0.9rem', py: 1 }}>
                    {schedule.pickupDate}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.9rem', py: 1 }}>
                    {schedule.pickupTime}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: '0.9rem',
                      py: 1,
                      maxWidth: 200,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {schedule.route}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.9rem', py: 1 }}>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {schedule.assignedDrivers && schedule.assignedDrivers.length > 0 ? (
                        schedule.assignedDrivers.map((driver) => (
                          <Chip
                            key={driver.id}
                            label={driver.name}
                            size="small"
                            sx={{
                              bgcolor: '#e8f5e9',
                              color: '#2e7d32',
                              fontWeight: 500,
                              fontSize: '0.8rem',
                            }}
                          />
                        ))
                      ) : (
                        <Typography sx={{ fontSize: '0.9rem', color: '#999' }}>
                          No drivers
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.9rem', py: 1 }}>
                    <Chip
                      label={getStatusLabel(schedule.status)}
                      size="small"
                      sx={{
                        bgcolor: getStatusColor(schedule.status),
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(schedule)}
                        sx={{ color: '#4d5f2b' }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(schedule)}
                        sx={{ color: '#d32f2f' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {filteredSchedules.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, page) => setCurrentPage(page)}
            color="primary"
            sx={{
              '& .MuiPaginationItem-root': {
                color: '#4d5f2b',
              },
              '& .MuiPaginationItem-page.Mui-selected': {
                bgcolor: '#4d5f2b',
                color: 'white',
              },
              '& .MuiPaginationItem-page.Mui-selected:hover': {
                bgcolor: '#3f4f24',
              },
            }}
          />
        </Box>
      )}

      <ScheduleModal
        open={modalOpen}
        onClose={handleClose}
        editingSchedule={editingSchedule}
      />

      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Delete Schedule"
        message="Are you sure you want to delete this schedule? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false)
          setEditingSchedule(null)
        }}
        confirmText="Delete"
        isLoading={deleteLoading}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Schedules