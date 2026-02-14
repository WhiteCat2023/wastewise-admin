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
import DriverModal from '../../components/modal/driver-modal'
import ConfirmationDialog from '../../components/dialog/ConfirmationDialog'
import { fetchDrivers, deleteDriver } from '../../service/driver/firebase'

function Drivers() {
  const [modalOpen, setModalOpen] = useState(false)
  const [drivers, setDrivers] = useState([])
  const [editingDriver, setEditingDriver] = useState(null)
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
    setEditingDriver(null)
    setModalOpen(true)
  }

  const handleClose = () => {
    setModalOpen(false)
    setEditingDriver(null)
  }

  const handleEdit = (driver) => {
    setEditingDriver(driver)
    setModalOpen(true)
  }

  const handleDeleteClick = (driver) => {
    setEditingDriver(driver)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!editingDriver) return
    setDeleteLoading(true)
    try {
      await deleteDriver(editingDriver.id)
      setSnackbar({
        open: true,
        message: 'Driver deleted successfully.',
        severity: 'success',
      })
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error deleting driver: ' + error.message,
        severity: 'error',
      })
    } finally {
      setDeleteLoading(false)
      setDeleteDialogOpen(false)
      setEditingDriver(null)
    }
  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbar((prev) => ({ ...prev, open: false }))
  }

  useEffect(() => {
    fetchDrivers(setDrivers)
  }, [])

  const filteredDrivers = drivers.filter((driver) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      driver.name.toLowerCase().includes(searchLower) ||
      driver.email.toLowerCase().includes(searchLower) ||
      driver.phone.toLowerCase().includes(searchLower) ||
      driver.vehicleNumber.toLowerCase().includes(searchLower) ||
      driver.licenseNumber.toLowerCase().includes(searchLower) ||
      driver.status.toLowerCase().includes(searchLower)
    )
  })

  const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedDrivers = filteredDrivers.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const getStatusColor = (status) => {
    const colors = {
      active: '#4CAF50',
      inactive: '#9E9E9E',
      'on-leave': '#FF9800',
    }
    return colors[status] || '#4d5f2b'
  }

  const getStatusLabel = (status) => {
    const labels = {
      active: 'Active',
      inactive: 'Inactive',
      'on-leave': 'On Leave',
    }
    return labels[status] || status
  }
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4d5f2b' }}>
          Drivers
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
          Create Driver
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          placeholder="Search by name, email, phone, vehicle number, license number, or status..."
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

      {drivers.length === 0 ? (
        <Paper sx={{ p: 4, bgcolor: '#f7fbd8', textAlign: 'center' }}>
          <Typography variant="body1" sx={{ color: '#666' }}>
            No drivers yet. Click "Create Driver" to add one!
          </Typography>
        </Paper>
      ) : filteredDrivers.length === 0 ? (
        <Paper sx={{ p: 4, bgcolor: '#f7fbd8', textAlign: 'center' }}>
          <Typography variant="body1" sx={{ color: '#666' }}>
            No drivers match your search. Try a different query!
          </Typography>
        </Paper>
      ) : (
        <TableContainer sx={{ bgcolor: 'white', borderRadius: 1 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f7fbd8', borderBottom: '2px solid #4d5f2b' }}>
                <TableCell sx={{ fontWeight: 600, color: '#3f4f24', fontSize: '0.9rem' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#3f4f24', fontSize: '0.9rem' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#3f4f24', fontSize: '0.9rem' }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#3f4f24', fontSize: '0.9rem' }}>Vehicle Number</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#3f4f24', fontSize: '0.9rem' }}>License Number</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#3f4f24', fontSize: '0.9rem' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#3f4f24', fontSize: '0.9rem' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedDrivers.map((driver) => (
                <TableRow
                  key={driver.id}
                  sx={{
                    borderBottom: '1px solid #f0f0f0',
                    '&:hover': { bgcolor: '#fafef5' },
                  }}
                >
                  <TableCell sx={{ fontSize: '0.9rem', py: 1 }}>{driver.name}</TableCell>
                  <TableCell sx={{ fontSize: '0.9rem', py: 1 }}>{driver.email}</TableCell>
                  <TableCell sx={{ fontSize: '0.9rem', py: 1 }}>{driver.phone}</TableCell>
                  <TableCell sx={{ fontSize: '0.9rem', py: 1 }}>{driver.vehicleNumber}</TableCell>
                  <TableCell sx={{ fontSize: '0.9rem', py: 1 }}>{driver.licenseNumber}</TableCell>
                  <TableCell sx={{ fontSize: '0.9rem', py: 1 }}>
                    <Chip
                      label={getStatusLabel(driver.status)}
                      size="small"
                      sx={{
                        bgcolor: getStatusColor(driver.status),
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
                        onClick={() => handleEdit(driver)}
                        sx={{ color: '#4d5f2b' }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(driver)}
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

      {filteredDrivers.length > 0 && (
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

      <DriverModal
        open={modalOpen}
        onClose={handleClose}
        editingDriver={editingDriver}
      />

      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Delete Driver"
        message="Are you sure you want to delete this driver? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false)
          setEditingDriver(null)
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

export default Drivers
