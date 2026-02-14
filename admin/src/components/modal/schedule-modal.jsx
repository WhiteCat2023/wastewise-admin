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
  Autocomplete,
  CircularProgress,
} from '@mui/material'
import { isBlankInput } from '../../utils/input-validation'
import { createSchedule, updateSchedule } from '../../service/schedule/firebase'
import { fetchDrivers } from '../../service/driver/firebase'

function ScheduleModal({ open, onClose, editingSchedule }) {
  const [pickupDate, setPickupDate] = useState('')
  const [pickupTime, setPickupTime] = useState('')
  const [assignedDrivers, setAssignedDrivers] = useState([])
  const [route, setRoute] = useState('')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState('scheduled')
  const [loading, setLoading] = useState(false)
  const [driversLoading, setDriversLoading] = useState(false)
  const [availableDrivers, setAvailableDrivers] = useState([])
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  })

  useEffect(() => {
    if (open) {
      fetchDriversList()
    }
  }, [open])

  const fetchDriversList = async () => {
    setDriversLoading(true)
    try {
      fetchDrivers(setAvailableDrivers)
    } catch (error) {
      console.error('Error fetching drivers:', error)
    } finally {
      setDriversLoading(false)
    }
  }

  useEffect(() => {
    if (editingSchedule && open) {
      setPickupDate(editingSchedule.pickupDate || '')
      setPickupTime(editingSchedule.pickupTime || '')
      setAssignedDrivers(editingSchedule.assignedDrivers || [])
      setRoute(editingSchedule.route || '')
      setNotes(editingSchedule.notes || '')
      setStatus(editingSchedule.status || 'scheduled')
    } else if (!open) {
      setPickupDate('')
      setPickupTime('')
      setAssignedDrivers([])
      setRoute('')
      setNotes('')
      setStatus('scheduled')
    }
  }, [open, editingSchedule])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    if (
      isBlankInput(pickupDate) ||
      isBlankInput(pickupTime) ||
      isBlankInput(route) ||
      assignedDrivers.length === 0
    ) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields and assign at least one driver.',
        severity: 'error',
      })
      setLoading(false)
      return
    }

    try {
      const scheduleData = {
        pickupDate: pickupDate.trim(),
        pickupTime: pickupTime.trim(),
        assignedDrivers: assignedDrivers.map((driver) => ({
          id: driver.id,
          name: driver.name,
        })),
        route: route.trim(),
        notes: notes.trim(),
        status,
      }

      if (editingSchedule) {
        await updateSchedule(editingSchedule.id, scheduleData)
        setSnackbar({
          open: true,
          message: 'Schedule updated successfully.',
          severity: 'success',
        })
      } else {
        await createSchedule(scheduleData)
        setSnackbar({
          open: true,
          message: 'Schedule created successfully.',
          severity: 'success',
        })
      }
      setPickupDate('')
      setPickupTime('')
      setAssignedDrivers([])
      setRoute('')
      setNotes('')
      setStatus('scheduled')
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
        {editingSchedule ? 'Edit Schedule' : 'Create Schedule'}
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            label="Pickup Date"
            type="date"
            value={pickupDate}
            onChange={(event) => setPickupDate(event.target.value)}
            fullWidth
            margin="normal"
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Pickup Time"
            type="time"
            value={pickupTime}
            onChange={(event) => setPickupTime(event.target.value)}
            fullWidth
            margin="normal"
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Autocomplete
            multiple
            options={availableDrivers}
            getOptionLabel={(option) => option.name}
            value={assignedDrivers}
            onChange={(event, newValue) => setAssignedDrivers(newValue)}
            filterSelectedOptions
            loading={driversLoading}
            sx={{ mt: 2, mb: 2 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Assign Drivers"
                placeholder="Select drivers"
                required
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {driversLoading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          <TextField
            label="Route"
            value={route}
            onChange={(event) => setRoute(event.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={3}
            placeholder="Enter the pickup route details"
            required
          />
          <TextField
            label="Notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={2}
            placeholder="Additional notes (optional)"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="schedule-status-label">Status</InputLabel>
            <Select
              labelId="schedule-status-label"
              label="Status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <MenuItem value="scheduled">Scheduled</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
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
          {editingSchedule ? 'Update' : 'Create'}
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

export default ScheduleModal
