import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
  Chip
} from '@mui/material';
import { format } from 'date-fns';
import { leadAPI } from '../services/api';

const ConnectedCallsTable = () => {
  const [connectedCalls, setConnectedCalls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchConnectedCalls();
  }, []);

  const fetchConnectedCalls = async () => {
    setLoading(true);
    try {
      const response = await leadAPI.getConnectedCalls();
      setConnectedCalls(response.data);
    } catch (error) {
      console.error('Error fetching connected calls:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getCallResponseColor = (response) => {
    switch (response) {
      case 'discussed':
        return 'success';
      case 'callback':
        return 'warning';
      case 'interested':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Connected Call Records
      </Typography>

      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Customer Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Call Date & Time</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Telecaller</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Call Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Phone Number</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? connectedCalls.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : connectedCalls
            ).map((call) => (
              <TableRow key={call._id} hover>
                <TableCell>{call.name}</TableCell>
                <TableCell>
                  {call.lastCallDate ? format(new Date(call.lastCallDate), 'MMM dd, yyyy HH:mm') : '-'}
                </TableCell>
                <TableCell>{call.assignedTo?.name || '-'}</TableCell>
                <TableCell>
                  <Chip
                    label={call.callResponse}
                    color={getCallResponseColor(call.callResponse)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{call.phoneNumber}</TableCell>
                <TableCell>{call.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={connectedCalls.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default ConnectedCallsTable; 