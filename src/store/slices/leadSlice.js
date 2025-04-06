import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  leads: [],
  loading: false,
  error: null,
  selectedLead: null,
};

const leadSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    fetchLeadsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchLeadsSuccess: (state, action) => {
      state.loading = false;
      state.leads = action.payload;
    },
    fetchLeadsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addLeadStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addLeadSuccess: (state, action) => {
      state.loading = false;
      state.leads.push(action.payload);
    },
    addLeadFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateLeadStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateLeadSuccess: (state, action) => {
      state.loading = false;
      const index = state.leads.findIndex(lead => lead._id === action.payload._id);
      if (index !== -1) {
        state.leads[index] = action.payload;
      }
    },
    updateLeadFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteLeadStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteLeadSuccess: (state, action) => {
      state.loading = false;
      state.leads = state.leads.filter(lead => lead._id !== action.payload);
    },
    deleteLeadFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setSelectedLead: (state, action) => {
      state.selectedLead = action.payload;
    },
  },
});

export const {
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
  setSelectedLead,
} = leadSlice.actions;

export default leadSlice.reducer; 