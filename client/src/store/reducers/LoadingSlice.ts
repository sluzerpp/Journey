import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LoadingState {
  loading: boolean,
  timer?: NodeJS.Timeout;
}

const initialState: LoadingState = {
  loading: true
}

export const LoadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setTimer(state, action: PayloadAction<NodeJS.Timeout | undefined>) {
      if (state.timer) {
        clearTimeout(state.timer);
      }
      state.timer = action.payload;
    }
  }
});

export default LoadingSlice.reducer;