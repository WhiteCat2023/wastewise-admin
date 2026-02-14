import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material'
import WarningIcon from '@mui/icons-material/Warning'

function ConfirmationDialog({
  open,
  title = 'Confirm Action',
  message = 'Are you sure?',
  onConfirm,
  onCancel,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isLoading = false,
}) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#d32f2f' }}>
        <WarningIcon />
        {title}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mt: 2 }}>
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel} sx={{ color: '#4d5f2b' }}>
          {cancelText}
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={isLoading}
          sx={{
            bgcolor: '#d32f2f',
            '&:hover': { bgcolor: '#b71c1c' },
            '&:disabled': { bgcolor: '#ef9a9a' },
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmationDialog
