import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import {
  fetchLeadsStart,
  fetchLeadsSuccess,
  fetchLeadsFailure,
  addLeadStart,
  addLeadSuccess,
  addLeadFailure,
  updateLeadStart,
  updateLeadSuccess,
  updateLeadFailure,
  deleteLeadStart,
  deleteLeadSuccess,
  deleteLeadFailure,
} from '../store/slices/leadSlice';
import { leadAPI } from '../services/api';

const TelecallerPage = () => {
  const dispatch = useDispatch();
  const { leads, loading } = useSelector((state) => state.leads);
  const [openDialog, setOpenDialog] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
  });
  const [statusData, setStatusData] = useState({
    status: '',
    callResponse: '',
    address: '',
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    dispatch(fetchLeadsStart());
    try {
      console.log('Fetching leads...');
      const response = await leadAPI.getAllLeads();
      console.log('Leads fetched successfully:', response.data);
      dispatch(fetchLeadsSuccess(response.data));
    } catch (error) {
      console.error('Error fetching leads:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch leads';
      dispatch(fetchLeadsFailure(errorMessage));
      toast.error(errorMessage);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      name: '',
      email: '',
      phoneNumber: '',
      address: '',
    });
  };

  const handleOpenStatusDialog = (lead) => {
    console.log('Opening status dialog with lead:', lead);
    setSelectedLead(lead);
    const initialStatus = lead.status || 'pending';
    const initialCallResponse = lead.callResponse || getDefaultCallResponse(initialStatus);
    
    console.log('Setting initial status data:', {
      status: initialStatus,
      callResponse: initialCallResponse,
      address: lead.address || ''
    });
    
    setStatusData({
      status: initialStatus,
      callResponse: initialCallResponse,
      address: lead.address || ''
    });
    setOpenStatusDialog(true);
  };

  const handleCloseStatusDialog = () => {
    setOpenStatusDialog(false);
    setSelectedLead(null);
    setStatusData({
      status: '',
      callResponse: '',
      address: '',
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleStatusChange = (event) => {
    const { name, value } = event.target;
    console.log('Status/Call Response change:', { name, value });

    if (name === 'status') {
      // When status changes, set appropriate default call response
      let defaultCallResponse = '';
      switch (value) {
        case 'connected':
          defaultCallResponse = 'discussed';
          break;
        case 'not_connected':
          defaultCallResponse = 'busy';
          break;
        case 'not_interested':
          defaultCallResponse = 'not_interested';
          break;
        case 'callback':
          defaultCallResponse = 'callback';
          break;
        case 'pending':
          defaultCallResponse = 'discussed';
          break;
        default:
          defaultCallResponse = '';
      }
      
      setStatusData(prev => ({
        ...prev,
        status: value,
        callResponse: defaultCallResponse
      }));
    } else {
      setStatusData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const getDefaultCallResponse = (status) => {
    switch (status) {
      case 'connected':
        return 'discussed';
      case 'not_connected':
        return 'busy';
      case 'not_interested':
        return 'not_interested';
      case 'callback':
        return 'callback';
      case 'pending':
        return 'discussed';
      default:
        return '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(addLeadStart());
    try {
      const response = await leadAPI.createLead(formData);
      dispatch(addLeadSuccess(response.data.lead));
      toast.success('Lead created successfully');
      handleCloseDialog();
    } catch (error) {
      dispatch(addLeadFailure(error.message));
      toast.error('Failed to create lead');
    }
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    if (!statusData.status || !statusData.callResponse) {
      toast.error('Please select both status and call response');
      return;
    }
    
    dispatch(updateLeadStart());
    try {
      console.log('Submitting status update:', {
        leadId: selectedLead._id,
        status: statusData.status,
        callResponse: statusData.callResponse,
        address: statusData.address
      });
      const response = await leadAPI.updateLeadStatus(selectedLead._id, statusData);
      console.log('Lead status updated successfully:', response.data);
      dispatch(updateLeadSuccess(response.data.lead));
      toast.success('Lead status updated successfully');
      handleCloseStatusDialog();
    } catch (error) {
      console.error('Error updating lead status:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update lead status';
      dispatch(updateLeadFailure(errorMessage));
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      dispatch(deleteLeadStart());
      try {
        await leadAPI.deleteLead(id);
        dispatch(deleteLeadSuccess(id));
        toast.success('Lead deleted successfully');
      } catch (error) {
        dispatch(deleteLeadFailure(error.message));
        toast.error('Failed to delete lead');
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <h1>Leads Management</h1>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Add New Lead
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Call Response</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead._id}>
                <TableCell>{lead.name}</TableCell>
                <TableCell>{lead.email}</TableCell>
                <TableCell>{lead.phoneNumber}</TableCell>
                <TableCell>{lead.address}</TableCell>
                <TableCell>
                  <Chip
                    label={lead.status || 'Not Called'}
                    color={
                      lead.status === 'connected'
                        ? 'success'
                        : lead.status === 'not_interested'
                        ? 'error'
                        : 'warning'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>{lead.callResponse || '-'}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleOpenStatusDialog(lead)}
                    sx={{ mr: 1 }}
                  >
                    Update Status
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(lead._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Lead Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add New Lead</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              margin="normal"
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Add Lead
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={openStatusDialog} onClose={handleCloseStatusDialog}>
        <DialogTitle>Update Lead Status</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              select
              label="Status"
              name="status"
              value={statusData.status}
              onChange={handleStatusChange}
              margin="normal"
              required
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="connected">Connected</MenuItem>
              <MenuItem value="not_connected">Not Connected</MenuItem>
              <MenuItem value="not_interested">Not Interested</MenuItem>
              <MenuItem value="callback">Callback</MenuItem>
            </TextField>
            
            <TextField
              fullWidth
              select
              label="Call Response"
              name="callResponse"
              value={statusData.callResponse}
              onChange={handleStatusChange}
              margin="normal"
              required
              disabled={!statusData.status}
            >
              {statusData.status === 'connected' && [
                <MenuItem key="discussed" value="discussed">Discussed</MenuItem>,
                <MenuItem key="callback" value="callback">Callback</MenuItem>,
                <MenuItem key="interested" value="interested">Interested</MenuItem>
              ]}
              {statusData.status === 'not_connected' && [
                <MenuItem key="busy" value="busy">Busy</MenuItem>,
                <MenuItem key="rnr" value="rnr">RNR (Ring No Response)</MenuItem>,
                <MenuItem key="switched_off" value="switched_off">Switched Off</MenuItem>
              ]}
              {statusData.status === 'pending' && [
                <MenuItem key="discussed" value="discussed">Discussed</MenuItem>,
                <MenuItem key="callback" value="callback">Callback</MenuItem>
              ]}
              {statusData.status === 'not_interested' && 
                <MenuItem value="not_interested">Not Interested</MenuItem>
              }
              {statusData.status === 'callback' && 
                <MenuItem value="callback">Callback</MenuItem>
              }
            </TextField>
            
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={statusData.address}
              onChange={handleStatusChange}
              margin="normal"
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusDialog}>Cancel</Button>
          <Button 
            onClick={handleStatusSubmit} 
            variant="contained"
            disabled={!statusData.status || !statusData.callResponse}
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TelecallerPage; 