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
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AnnouncementModal from '../../components/modal/announcement-modal'
import ConfirmationDialog from '../../components/dialog/ConfirmationDialog'
import { fetchAnnouncements, deleteAnnouncement } from '../../service/announcement/firebase'

function Announcements() {
  const [modalOpen, setModalOpen] = useState(false)
  const [announcements, setAnnouncements] = useState([])
  const [editingAnnouncement, setEditingAnnouncement] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  })

  const handleOpen = () => {
    setEditingAnnouncement(null)
    setModalOpen(true)
  }

  const handleClose = () => {
    setModalOpen(false)
    setEditingAnnouncement(null)
  }

  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement)
    setModalOpen(true)
  }

  const handleDeleteClick = (announcement) => {
    setEditingAnnouncement(announcement)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!editingAnnouncement) return
    setDeleteLoading(true)
    try {
      await deleteAnnouncement(editingAnnouncement.id)
      setSnackbar({
        open: true,
        message: 'Announcement deleted successfully.',
        severity: 'success',
      })
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error deleting announcement: ' + error.message,
        severity: 'error',
      })
    } finally {
      setDeleteLoading(false)
      setDeleteDialogOpen(false)
      setEditingAnnouncement(null)
    }
  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbar((prev) => ({ ...prev, open: false }))
  }

  useEffect(() => {
    fetchAnnouncements(setAnnouncements)
  }, [])

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4d5f2b' }}>
          Announcements
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
          Create Announcement
        </Button>
      </Box>

      {announcements.length === 0 ? (
        <Paper sx={{ p: 4, bgcolor: '#f7fbd8', textAlign: 'center' }}>
          <Typography variant="body1" sx={{ color: '#666' }}>
            No announcements yet. Click "Create Announcement" to add one!
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#4d5f2b' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Title</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Message</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Next Pickup</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Schedule</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Created By</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {announcements.map((announcement, index) => (
                <TableRow
                  key={announcement.id}
                  sx={{
                    bgcolor: index % 2 === 0 ? '#f9fbf5' : 'white',
                    '&:hover': { bgcolor: '#f3f7cf' },
                  }}
                >
                  <TableCell sx={{ fontWeight: 'bold', color: '#4d5f2b' }}>
                    {announcement.title}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: 'inline-block',
                        bgcolor: '#f0f0f0',
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        color: '#666',
                      }}
                    >
                      {announcement.type}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {announcement.message.substring(0, 50)}...
                  </TableCell>
                  <TableCell>{announcement.nextPickup || '-'}</TableCell>
                  <TableCell>{announcement.schedule || '-'}</TableCell>
                  <TableCell>{announcement.createdBy || '-'}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(announcement)}
                        sx={{ color: '#4d5f2b', mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(announcement)}
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

      <AnnouncementModal
        open={modalOpen}
        onClose={handleClose}
        editingAnnouncement={editingAnnouncement}
      />

      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Delete Announcement"
        message="Are you sure you want to delete this announcement? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false)
          setEditingAnnouncement(null)
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

export default Announcements
