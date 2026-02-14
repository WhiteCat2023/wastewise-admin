import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { isBlankInput } from '../../utils/input-validation'
import { createDriver, updateDriver } from '../../service/driver/firebase'

function DriverModal({ open, onClose, editingDriver }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [vehicleNumber, setVehicleNumber] = useState('')
  const [licenseNumber, setLicenseNumber] = useState('')
  const [status, setStatus] = useState('active')
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  })

  useEffect(() => {
    if (editingDriver && open) {
      setName(editingDriver.name || '')
      setEmail(editingDriver.email || '')
      setPhone(editingDriver.phone || '')
      setVehicleNumber(editingDriver.vehicleNumber || '')
      setLicenseNumber(editingDriver.licenseNumber || '')
      setStatus(editingDriver.status || 'active')
    } else if (!open) {
      setName('')
      setEmail('')
      setPhone('')
      setVehicleNumber('')
      setLicenseNumber('')
      setStatus('active')
    }
  }, [open, editingDriver])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    if (
      isBlankInput(name) ||
      isBlankInput(email) ||
      isBlankInput(phone) ||
      isBlankInput(vehicleNumber) ||
      isBlankInput(licenseNumber)
    ) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields.',
        severity: 'error',
      })
      setLoading(false)
      return
    }

    try {
      if (editingDriver) {
        await updateDriver(editingDriver.id, {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          vehicleNumber: vehicleNumber.trim(),
          licenseNumber: licenseNumber.trim(),
          status,
        })
        setSnackbar({
          open: true,
          message: 'Driver updated successfully.',
          severity: 'success',
        })
      } else {
        await createDriver({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          vehicleNumber: vehicleNumber.trim(),
          licenseNumber: licenseNumber.trim(),
          status,
        })
        setSnackbar({
          open: true,
          message: 'Driver created successfully.',
          severity: 'success',
        })
      }
      setName('')
      setEmail('')
      setPhone('')
      setVehicleNumber('')
      setLicenseNumber('')
      setStatus('active')
      onClose?.()
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error: ' + error.message,
        severity: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    onClose?.()
  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbar((prev) => ({ ...prev, open: false }))
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: '#4d5f2b', fontWeight: 'bold' }}>
        {editingDriver ? 'Edit Driver' : 'Create Driver'}
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            label="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Phone"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Vehicle Number"
            value={vehicleNumber}
            onChange={(event) => setVehicleNumber(event.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="License Number"
            value={licenseNumber}
            onChange={(event) => setLicenseNumber(event.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="driver-status-label">Status</InputLabel>
            <Select
              labelId="driver-status-label"
              label="Status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="on-leave">On Leave</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} sx={{ color: '#4d5f2b' }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            bgcolor: '#4d5f2b',
            '&:hover': { bgcolor: '#3f4f24' },
            '&:disabled': { bgcolor: '#a0ab7e' },
          }}
        >
          {editingDriver ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
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
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  )
}

export default DriverModal
