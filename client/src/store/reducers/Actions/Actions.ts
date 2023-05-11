import { AppDispatch } from "../..";
import { ErrorSlice } from "../ErrorSlice";
import { LoadingSlice } from "../LoadingSlice";
import { SignSlice } from "../UserSlices";

export const startLoading = () => (dispatch: AppDispatch) => {
  dispatch(LoadingSlice.actions.setLoading(true));
  dispatch(LoadingSlice.actions.setTimer());
}

export const stopLoading = () => (dispatch: AppDispatch) => {
  dispatch(LoadingSlice.actions.setTimer(setTimeout(() => {
    dispatch(LoadingSlice.actions.setLoading(false));
  }, 500)))
}

export const signIn = () => (dispatch: AppDispatch) => {
  dispatch(SignSlice.actions.setSign(true));
}

export const showError = (message: string, status?: number) => (dispatch: AppDispatch) => {
  dispatch(ErrorSlice.actions.setError({isError: true, message}));
}

export const hideError = () => (dispatch: AppDispatch) => {
  dispatch(ErrorSlice.actions.setError({isError: false, message: ''}));
}