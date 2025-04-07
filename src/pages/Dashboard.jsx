import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  fetchDashboardStart,
  fetchDashboardSuccess,
  fetchDashboardFailure,
} from '../store/slices/dashboardSlice';
import { dashboardAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { metrics, callTrends, recentCalls, loading } = useSelector(
    (state) => state.dashboard
  );

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    dispatch(fetchDashboardStart());
    try {
      const response = await dashboardAPI.getMetrics();
      dispatch(fetchDashboardSuccess(response.data));
    } catch (error) {
      dispatch(fetchDashboardFailure(error.message));
      toast.error('Failed to fetch dashboard data');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'connected':
        return 'success';
      case 'not_connected':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box className="dashboard-container">
      <Typography variant="h4" className="dashboard-title">
        Dashboard 
      </Typography>

      {/* Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Paper className="metrics-card" sx={{ p: 3 }}>
            <Typography color="textSecondary" gutterBottom>
              Total Telecallers
            </Typography>
            <Typography variant="h4">{metrics.totalTelecallers}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper className="metrics-card" sx={{ p: 3 }}>
            <Typography color="textSecondary" gutterBottom>
              Total Calls Made
            </Typography>
            <Typography variant="h4">{metrics.totalCalls}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper className="metrics-card" sx={{ p: 3 }}>
            <Typography color="textSecondary" gutterBottom>
              Total Customers Contacted
            </Typography>
            <Typography variant="h4">
              {metrics.totalCustomersContacted}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Call Trends Chart */}
      <Paper className="chart-container">
        <Typography variant="h6" className="chart-title">
          Call Trends (Last 7 Days)
        </Typography>
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={callTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      {/* Recent Calls Table */}
      <Paper className="recent-calls-table">
        <Typography variant="h6" className="chart-title" sx={{ p: 2 }}>
          Recent Connected Calls
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Customer Name</TableCell>
                <TableCell>Telecaller</TableCell>
                <TableCell>Call Date & Time</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentCalls.map((call) => (
                <TableRow key={call._id}>
                  <TableCell>{call.name}</TableCell>
                  <TableCell>{call.assignedTo.name}</TableCell>
                  <TableCell>{formatDate(call.lastCallDate)}</TableCell>
                  <TableCell>
                    <Chip
                      label={call.callResponse}
                      color={getStatusColor(call.callResponse)}
                      className="status-chip"
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Dashboard; 