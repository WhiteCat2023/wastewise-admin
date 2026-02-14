import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { isBlankInput } from '../../utils/input-validation'
import { useAuthService } from '../../service/auth/auth.firebase'
import { submitAnnouncement } from '../../service/announcement/firebase'

function AnnouncementModal({ open, onClose}) {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [type, setType] = useState('')
  const [nextPickupDate, setNextPickupDate] = useState('')
  const [scheduleDay, setScheduleDay] = useState('')
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  })
  const { user } = useAuthService();

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    if (
      isBlankInput(title) ||
      isBlankInput(message) ||
      isBlankInput(type)
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
      await submitAnnouncement({
        title: title.trim(),
        message: message.trim(),
        type: type,
        nextPickupDate: formatDateToMonthDay(nextPickupDate),
        scheduleDay: scheduleDay || null,
        createdBy: user?.email || null,
      })
      setTitle('')
      setMessage('')
      setNextPickupDate('')
      setScheduleDay('')
      onClose?.()
      setSnackbar({
        open: true,
        message: 'Announcement published successfully.',
        severity: 'success',
      })
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error publishing announcement: ' + error.message,
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

  const formatDateToMonthDay = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    const monthAbbr = date.toLocaleString('en-US', { month: 'short' })
    const day = date.getDate()
    return `${monthAbbr} ${day}`
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: '#4d5f2b', fontWeight: 'bold' }}>
        Create Announcement
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            label="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="announcement-type-label">Type</InputLabel>
            <Select
              labelId="announcement-type-label"
              label="Type"
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              <MenuItem value="recyclables">Recyclables</MenuItem>
              <MenuItem value="green-waste">Green Waste</MenuItem>
              <MenuItem value="holiday-schedule">Holiday Schedule</MenuItem>
              <MenuItem value="regular-trash">Regular Trash</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Next Pickup Date"
            type="date"
            value={nextPickupDate}
            onChange={(event) => setNextPickupDate(event.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="announcement-schedule-label">Schedule</InputLabel>
            <Select
              labelId="announcement-schedule-label"
              label="Schedule"
              value={scheduleDay}
              onChange={(event) => setScheduleDay(event.target.value)}
            >
              <MenuItem value="Every Monday">Every Monday</MenuItem>
              <MenuItem value="Every Tuesday">Every Tuesday</MenuItem>
              <MenuItem value="Every Wednesday">Every Wednesday</MenuItem>
              <MenuItem value="Every Thursday">Every Thursday</MenuItem>
              <MenuItem value="Every Friday">Every Friday</MenuItem>
              <MenuItem value="Every Saturday">Every Saturday</MenuItem>
              <MenuItem value="Every Sunday">Every Sunday</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            label="Message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            fullWidth
            margin="normal"
            multiline
            minRows={4}
          />
          <Typography variant="caption" sx={{ color: '#6b7a4a' }}>
            Announcements will be visible to all users.
          </Typography>
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
          sx={{ bgcolor: '#4d5f2b', '&:hover': { bgcolor: '#3f4f24' }, '&:disabled': { bgcolor: '#a0ab7e' } }}
        >
          Publish
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

export default AnnouncementModal