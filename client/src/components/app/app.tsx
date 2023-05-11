import React, { memo, useCallback, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import Loading from '../loading/Loading';
import { fetchQuest } from '../../store/reducers/Actions/ActionCreators';
import MainPage from '../../pages/MainPage';
import AuthorizationPage from '../../pages/mainPages/AuthorizationPage';
import { fetchUserCheck } from '../../store/reducers/Actions/UserActionCreators';
import { hideError, signIn, startLoading, stopLoading } from '../../store/reducers/Actions/Actions';
import { AppDispatch } from '../../store';
import ErrorAlert from '../error/ErrorAlert';
import Page from './Page';

const MemoLoading = memo(Loading);

function App() {
  const {loading} = useAppSelector(state => state.loadingReducer);

  return (
    <>
      {loading && <MemoLoading></MemoLoading>}
      <Page></Page>
    </>
  );  
}

export default App;
