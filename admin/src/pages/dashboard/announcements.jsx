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
  TextField,
  Chip,
  Pagination,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search'
import AnnouncementModal from '../../components/modal/announcement-modal'
import ConfirmationDialog from '../../components/dialog/ConfirmationDialog'
import { fetchAnnouncements, deleteAnnouncement } from '../../service/announcement/firebase'

function Announcements() {
  const [modalOpen, setModalOpen] = useState(false)
  const [announcements, setAnnouncements] = useState([])
  const [editingAnnouncement, setEditingAnnouncement] = useState(null)
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

  const filteredAnnouncements = announcements.filter((announcement) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      announcement.title.toLowerCase().includes(searchLower) ||
      announcement.type.toLowerCase().includes(searchLower) ||
      (announcement.schedule && announcement.schedule.toLowerCase().includes(searchLower))
    )
  })

  const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedAnnouncements = filteredAnnouncements.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

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

      <Box sx={{ mb: 3 }}>
        <TextField
          placeholder="Search by title, type, or schedule..."
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

      {announcements.length === 0 ? (
        <Paper sx={{ p: 4, bgcolor: '#f7fbd8', textAlign: 'center' }}>
          <Typography variant="body1" sx={{ color: '#666' }}>
            No announcements yet. Click "Create Announcement" to add one!
          </Typography>
        </Paper>
      ) : filteredAnnouncements.length === 0 ? (
        <Paper sx={{ p: 4, bgcolor: '#f7fbd8', textAlign: 'center' }}>
          <Typography variant="body1" sx={{ color: '#666' }}>
            No announcements match your search. Try a different query!
          </Typography>
        </Paper>
      ) : (
        <TableContainer sx={{ bgcolor: 'white', borderRadius: 1 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f7fbd8', borderBottom: '2px solid #4d5f2b' }}>
                <TableCell sx={{ fontWeight: 600, color: '#3f4f24', fontSize: '0.9rem' }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#3f4f24', fontSize: '0.9rem' }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#3f4f24', fontSize: '0.9rem' }}>Message</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#3f4f24', fontSize: '0.9rem' }}>Next Pickup</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#3f4f24', fontSize: '0.9rem' }}>Schedule</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#3f4f24', fontSize: '0.9rem' }}>Created By</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#3f4f24', fontSize: '0.9rem' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedAnnouncements.map((announcement) => (
                <TableRow
                  key={announcement.id}
                  sx={{
                    borderBottom: '1px solid #f0f0f0',
                    '&:hover': { bgcolor: '#fafef5' },
                  }}
                >
                  <TableCell sx={{ fontSize: '0.9rem', py: 1 }}>{announcement.title}</TableCell>
                  <TableCell sx={{ fontSize: '0.9rem', py: 1 }}>
                    <Chip
                      label={announcement.type}
                      size="small"
                      sx={{
                        bgcolor: '#f3f7cf',
                        color: '#3f4f24',
                        fontWeight: 500,
                        fontSize: '0.8rem',
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.9rem', py: 1, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {announcement.message.substring(0, 50)}...
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.9rem', py: 1 }}>{announcement.nextPickup || '-'}</TableCell>
                  <TableCell sx={{ fontSize: '0.9rem', py: 1 }}>{announcement.schedule || '-'}</TableCell>
                  <TableCell sx={{ fontSize: '0.9rem', py: 1 }}>{announcement.createdBy || '-'}</TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(announcement)}
                        sx={{ color: '#4d5f2b' }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(announcement)}
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

      {filteredAnnouncements.length > 0 && (
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
