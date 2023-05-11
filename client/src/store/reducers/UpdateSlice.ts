import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LoadingState {
  loading: boolean,
  error: string,
}

const initialState: LoadingState = {
  loading: false,
  error: ''
}

export const UpdateSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    }
  }
});

export default UpdateSlice.reducer;