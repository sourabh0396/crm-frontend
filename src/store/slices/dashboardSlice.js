import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  metrics: {
    totalTelecallers: 0,
    totalCalls: 0,
    totalCustomersContacted: 0,
  },
  callTrends: [],
  recentCalls: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    fetchDashboardStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchDashboardSuccess: (state, action) => {
      state.loading = false;
      state.metrics = action.payload.metrics;
      state.callTrends = action.payload.callTrends;
      state.recentCalls = action.payload.recentCalls;
    },
    fetchDashboardFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchDashboardStart,
  fetchDashboardSuccess,
  fetchDashboardFailure,
} = dashboardSlice.actions;

export default dashboardSlice.reducer; 