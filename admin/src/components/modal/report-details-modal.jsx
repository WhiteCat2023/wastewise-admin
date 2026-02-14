import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Grid,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

function ReportDetailsModal({ open, onClose, report }) {
  if (!report) return null

  const lat = report.latitude || report.lat || 0
  const lng = report.longitude || report.lng || 0
  const center = [lat, lng] || [40.7128, -74.006]

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A'
    try {
      const date = timestamp.toDate?.() || new Date(timestamp)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch (error) {
      return 'N/A'
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: '#4d5f2b',
          color: 'white',
          fontWeight: 'bold',
          py: 1.5,
        }}
      >
        Report Details
        <IconButton
          onClick={onClose}
          sx={{ color: 'white' }}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2, pb: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Quick Info */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="caption" sx={{ color: '#666', fontWeight: 'bold', display: 'block', mb: 0.3 }}>
                Description
              </Typography>
              <Typography variant="body2" sx={{ color: '#333' }}>
                {report.description || '-'}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="caption" sx={{ color: '#666', fontWeight: 'bold', display: 'block', mb: 0.3 }}>
                Type
              </Typography>
              <Typography variant="body2" sx={{ color: '#333' }}>
                {report.type || '-'}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="caption" sx={{ color: '#666', fontWeight: 'bold', display: 'block', mb: 0.3 }}>
                Status
              </Typography>
              <Box
                sx={{
                  display: 'inline-block',
                  px: 1,
                  py: 0.3,
                  bgcolor: report.status === 'completed' ? '#c8e6c9' : '#fff9c4',
                  color: report.status === 'completed' ? '#2e7d32' : '#f57f17',
                  borderRadius: 0.5,
                  fontWeight: 'bold',
                  fontSize: '0.75rem',
                }}
              >
                {report.status || 'Pending'}
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="caption" sx={{ color: '#666', fontWeight: 'bold', display: 'block', mb: 0.3 }}>
                Created
              </Typography>
              <Typography variant="body2" sx={{ color: '#333', fontSize: '0.875rem' }}>
                {formatDate(report.createdAt)}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="caption" sx={{ color: '#666', fontWeight: 'bold', display: 'block', mb: 0.3 }}>
                Coordinates
              </Typography>
              <Typography variant="body2" sx={{ color: '#333', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                {lat}, {lng}
              </Typography>
            </Grid>
          </Grid>

          {/* Map */}
          <Box sx={{ height: '300px', borderRadius: 1, overflow: 'hidden', mt: 1 }}>
            <MapContainer center={center} zoom={15} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {lat && lng && (
                <Marker position={center}>
                  <Popup>
                    <Typography variant="caption">
                      {report.description || 'Report Location'}
                    </Typography>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 1.5 }}>
        <Button
          onClick={onClose}
          sx={{
            bgcolor: '#4d5f2b',
            color: 'white',
            textTransform: 'none',
            fontWeight: 'bold',
            px: 3,
            '&:hover': { bgcolor: '#3f4f24' },
          }}
          size="small"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ReportDetailsModal
