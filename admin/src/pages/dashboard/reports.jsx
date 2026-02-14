import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
  TextField,
  Pagination,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { fetchReports } from '../../service/reports/firebase'
import ReportDetailsModal from '../../components/modal/report-details-modal'

function Reports() {
  const [reports, setReports] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedReport, setSelectedReport] = useState(null)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  })
  const itemsPerPage = 5

  const handleReportClick = (report) => {
    setSelectedReport(report)
    setDetailsModalOpen(true)
  }

  const handleCloseDetailsModal = () => {
    setDetailsModalOpen(false)
    setSelectedReport(null)
  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbar((prev) => ({ ...prev, open: false }))
  }

  useEffect(() => {
    const unsubscribe = fetchReports(setReports)
    return () => unsubscribe()
  }, [])

  const filteredReports = reports.filter((report) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      (report.description && report.description.toLowerCase().includes(searchLower)) ||
      (report.status && report.status.toLowerCase().includes(searchLower)) ||
      (report.type && report.type.toLowerCase().includes(searchLower))
    )
  })

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedReports = filteredReports.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

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
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4d5f2b' }}>
          Reports
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          placeholder="Search by description, type, or status..."
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

      {reports.length === 0 ? (
        <Paper sx={{ p: 4, bgcolor: '#f7fbd8', textAlign: 'center' }}>
          <Typography variant="body1" sx={{ color: '#666' }}>
            No reports found.
          </Typography>
        </Paper>
      ) : filteredReports.length === 0 ? (
        <Paper sx={{ p: 4, bgcolor: '#f7fbd8', textAlign: 'center' }}>
          <Typography variant="body1" sx={{ color: '#666' }}>
            No reports match your search. Try a different query!
          </Typography>
        </Paper>
      ) : (
        <TableContainer sx={{ bgcolor: 'white', borderRadius: 1 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f7fbd8', borderBottom: '2px solid #4d5f2b' }}>
                <TableCell sx={{ fontWeight: 600, color: '#3f4f24', fontSize: '0.9rem' }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#3f4f24', fontSize: '0.9rem' }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#3f4f24', fontSize: '0.9rem' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#3f4f24', fontSize: '0.9rem' }}>Created Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedReports.map((report) => (
                <TableRow
                  key={report.id}
                  onClick={() => handleReportClick(report)}
                  sx={{
                    borderBottom: '1px solid #f0f0f0',
                    '&:hover': { bgcolor: '#fafef5', cursor: 'pointer' },
                  }}
                >
                  <TableCell sx={{ fontSize: '0.9rem', py: 1, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {report.description || '-'}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.9rem', py: 1 }}>
                    {report.type || '-'}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.9rem', py: 1 }}>
                    <Box
                      sx={{
                        display: 'inline-block',
                        px: 1.5,
                        py: 0.5,
                        bgcolor: report.status === 'completed' ? '#c8e6c9' : '#fff9c4',
                        color: report.status === 'completed' ? '#2e7d32' : '#f57f17',
                        borderRadius: 0.5,
                        fontWeight: 'bold',
                        fontSize: '0.8rem',
                      }}
                    >
                      {report.status || 'Pending'}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.9rem', py: 1 }}>
                    {formatDate(report.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {filteredReports.length > 0 && (
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

      <ReportDetailsModal
        open={detailsModalOpen}
        onClose={handleCloseDetailsModal}
        report={selectedReport}
      />
    </Box>
  )
}

export default Reports
