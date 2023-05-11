import { AxiosError, AxiosResponse } from "axios";
import { AppDispatch } from "../..";
import { $authHost, $host } from "../../../http";
import { IToken, IUser, IUserRequest } from "../../../types/IUser";
import {UpdateSlice} from "../UpdateSlice";
import {UserSlice, UserTokenSlice} from '../UserSlices';
import { startLoading, stopLoading } from "./Actions";

export const fetchUserAuth = (data: IUserRequest, action: 'registration' | 'login') => async (dispatch: AppDispatch) => {
  try {
    dispatch(UserTokenSlice.actions.userTokenFetching());
    const response = await $host.post<IToken>(`api/users/${action}`, data);
    dispatch(UserTokenSlice.actions.userTokenFetchingSuccess(response.data))
  } catch (e) {
    const error = await e as AxiosError;
    const data = error.response?.data as {message: string};
    dispatch(UserTokenSlice.actions.userTokenFetchingError(data.message))
  }
}

export const fetchUserCheck = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(UserTokenSlice.actions.userTokenFetching());
    const response = await $authHost.get<IToken>('api/users/auth');
    dispatch(UserTokenSlice.actions.userTokenFetchingSuccess(response.data));
  } catch (e) {
    const error = e as AxiosError;
    const data = error.response?.data as {message: string};
    dispatch(UserTokenSlice.actions.userTokenFetchingError(data.message || ''))
  }
}

export const fetchUser = () => async (dispatch: AppDispatch) => {
  try {
    const response = await $authHost.get<IUser>('api/users');
    dispatch(UserSlice.actions.userFetchingSuccess(response.data));
  } catch (e) {
    const error = e as Error;
    dispatch(UserSlice.actions.userFetchingError(error.message))
  }
}