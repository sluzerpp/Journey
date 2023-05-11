import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IErrorState } from "../../types/IError";

const initialState: IErrorState = {
  isError: false,
  message: ''
}

export const ErrorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setError(state, action: PayloadAction<IErrorState>) {
      state.isError = action.payload.isError;
      if (action.payload.message) {
        state.message = action.payload.message;
      }
    },
  }
});

export default ErrorSlice.reducer;