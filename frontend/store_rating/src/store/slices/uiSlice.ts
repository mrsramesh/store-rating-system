import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  loading: boolean;
  notification: {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  } | null;
}

const initialState: UIState = {
  loading: false,
  notification: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    showNotification: (state, action: PayloadAction<{
      message: string;
      severity: 'success' | 'error' | 'warning' | 'info';
    }>) => {
      state.notification = {
        open: true,
        ...action.payload,
      };
    },
    hideNotification: (state) => {
      state.notification = null;
    },
  },
});

export const { setLoading, showNotification, hideNotification } = uiSlice.actions;
export default uiSlice.reducer;