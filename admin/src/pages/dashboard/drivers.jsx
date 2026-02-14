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
  Tooltip,
  Snackbar,
  Alert,
  Chip,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import DriverModal from '../../components/modal/driver-modal'
import ConfirmationDialog from '../../components/dialog/ConfirmationDialog'
import { fetchDrivers, deleteDriver } from '../../service/driver/firebase'

function Drivers() {
  const [modalOpen, setModalOpen] = useState(false)
  const [drivers, setDrivers] = useState([])
  const [editingDriver, setEditingDriver] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  })

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

      {drivers.length === 0 ? (
        <Paper sx={{ p: 4, bgcolor: '#f7fbd8', textAlign: 'center' }}>
          <Typography variant="body1" sx={{ color: '#666' }}>
            No drivers yet. Click "Create Driver" to add one!
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#4d5f2b' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Phone</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Vehicle Number</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>License Number</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {drivers.map((driver, index) => (
                <TableRow
                  key={driver.id}
                  sx={{
                    bgcolor: index % 2 === 0 ? '#f9fbf5' : 'white',
                    '&:hover': { bgcolor: '#f3f7cf' },
                  }}
                >
                  <TableCell sx={{ fontWeight: 'bold', color: '#4d5f2b' }}>
                    {driver.name}
                  </TableCell>
                  <TableCell>{driver.email}</TableCell>
                  <TableCell>{driver.phone}</TableCell>
                  <TableCell>{driver.vehicleNumber}</TableCell>
                  <TableCell>{driver.licenseNumber}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(driver.status)}
                      sx={{
                        bgcolor: getStatusColor(driver.status),
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(driver)}
                        sx={{ color: '#4d5f2b', mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(driver)}
                        sx={{ color: '#d32f2f' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
