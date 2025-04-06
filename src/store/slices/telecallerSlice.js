import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  telecallers: [],
  loading: false,
  error: null,
};

const telecallerSlice = createSlice({
  name: 'telecaller',
  initialState,
  reducers: {
    fetchTelecallersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTelecallersSuccess: (state, action) => {
      state.loading = false;
      state.telecallers = action.payload;
    },
    fetchTelecallersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchTelecallersStart,
  fetchTelecallersSuccess,
  fetchTelecallersFailure,
} = telecallerSlice.actions;

export default telecallerSlice.reducer; 