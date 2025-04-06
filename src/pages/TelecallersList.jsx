import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  CircularProgress,
  Chip,
  IconButton,
  Collapse,
  TablePagination,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { fetchTelecallersStart, fetchTelecallersSuccess, fetchTelecallersFailure } from '../store/slices/telecallerSlice';
import { telecallerAPI } from '../services/api';

const TelecallerRow = ({ telecaller }) => {
  const [open, setOpen] = useState(false);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const response = await telecallerAPI.getTelecallerActivities(telecaller._id);
      setActivities(response.data);
    } catch (error) {
      toast.error('Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    setOpen(!open);
    if (!activities.length) {
      fetchActivities();
    }
  };

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton size="small" onClick={handleClick}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{telecaller.name}</TableCell>
        <TableCell>{telecaller.email}</TableCell>
        <TableCell>{telecaller.phone}</TableCell>
        <TableCell>
          <Chip
            label={telecaller.status}
            color={telecaller.status === 'active' ? 'success' : 'error'}
          />
        </TableCell>
        <TableCell>{telecaller.totalCalls || 0}</TableCell>
        <TableCell>{telecaller.connectedCalls || 0}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Recent Activities
              </Typography>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Notes</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activities.map((activity) => (
                      <TableRow key={activity._id}>
                        <TableCell>
                          {new Date(activity.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell>{activity.customerName}</TableCell>
                        <TableCell>
                          <Chip
                            label={activity.status}
                            color={
                              activity.status === 'connected'
                                ? 'success'
                                : activity.status === 'not-interested'
                                ? 'error'
                                : 'warning'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{activity.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const TelecallersList = () => {
  const dispatch = useDispatch();
  const { telecallers, loading } = useSelector((state) => state.telecaller);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchTelecallers = async () => {
      dispatch(fetchTelecallersStart());
      try {
        const response = await telecallerAPI.getAllTelecallers();
        dispatch(fetchTelecallersSuccess(response.data));
      } catch (error) {
        dispatch(fetchTelecallersFailure(error.response?.data?.message || 'Failed to fetch telecallers'));
        toast.error(error.response?.data?.message || 'Failed to fetch telecallers');
      }
    };

    fetchTelecallers();
  }, [dispatch]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ p: 2 }}>
          Telecallers Management
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Total Calls</TableCell>
                <TableCell>Connected Calls</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {telecallers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((telecaller) => (
                  <TelecallerRow key={telecaller._id} telecaller={telecaller} />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={telecallers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Container>
  );
};

export default TelecallersList; 