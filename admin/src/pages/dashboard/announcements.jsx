import React, { useState } from 'react'
import { Box, Typography, Paper, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import AnnouncementModal from '../../components/modal/announcement-modal'

function Announcements() {
  const [modalOpen, setModalOpen] = useState(false)

  const handleOpen = () => setModalOpen(true)
  const handleClose = () => setModalOpen(false)

  const handleSubmit = (data) => {
    // TODO: Replace with API call / state update
    console.log('Announcement created:', data)
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#4d5f2b' }}>
        Announcement
      </Typography>
      <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
      }}>

        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          sx={{ mb: 2, bgcolor: '#4d5f2b', '&:hover': { bgcolor: '#3f4f24' }, borderRadius: 2, textTransform: 'none' }}
        >
          <AddIcon sx={{ mr: 1 }} />  
          <Typography variant="button" sx={{ fontWeight: 'bold' }}>
            Create Announcement
          </Typography>
        </Button>
      </Box>
      <Paper sx={{ p: 3, bgcolor: 'white' }}>
        <Typography variant="body2" sx={{ color: '#999' }}>
          Announcement management page - Coming soon!
        </Typography>
      </Paper>
      <AnnouncementModal
        open={modalOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    </Box>
  )
}

export default Announcements
