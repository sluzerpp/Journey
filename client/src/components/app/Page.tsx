import React, { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import MainPage from '../../pages/MainPage';
import { AppDispatch } from '../../store';
import { signIn, startLoading, stopLoading } from '../../store/reducers/Actions/Actions';
import { fetchUserCheck } from '../../store/reducers/Actions/UserActionCreators';
import ErrorAlert from '../error/ErrorAlert';

export default function Page() {
  const {loading} = useAppSelector(state => state.loadingReducer);
  const {isSingIn} = useAppSelector(state => state.SignReducer);

  const dispatch = useAppDispatch();
  const {token} = useAppSelector(state => state.UserTokenReducer);

  const checkAuth = async (dispatch: AppDispatch, localToken: string | null) => {
    if (localToken) {
      dispatch(startLoading());
      await dispatch(fetchUserCheck());
    }
    dispatch(stopLoading());
  }

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      dispatch(signIn());
    }
  }, [token])

  useEffect(() => {
    const localToken = localStorage.getItem('token');
    checkAuth(dispatch, localToken);
  }, [])
  
  return (
      
      (!loading || isSingIn) ?
      <div className="app">
        <ErrorAlert></ErrorAlert>
        <MainPage></MainPage>
      </div>
      : null
  )
}
