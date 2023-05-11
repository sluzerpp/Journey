import React, { useEffect } from 'react'
import { isMobile } from 'react-device-detect'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navigation from '../components/navigation/navigation'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { AppDispatch } from '../store'
import { fetchQuest } from '../store/reducers/Actions/ActionCreators'
import { signIn, startLoading, stopLoading } from '../store/reducers/Actions/Actions'
import { setUserPos } from '../store/reducers/Actions/MapActionCreators'
import { fetchQuestRoutes } from '../store/reducers/Actions/QuestRouteActionCreators'
import { fetchUser, fetchUserCheck } from '../store/reducers/Actions/UserActionCreators'
import AdminPage from './mainPages/AdminPage'
import AuthorizationPage from './mainPages/AuthorizationPage'
import MapPage from './mainPages/MapPage'
import MyQuestPage from './mainPages/MyQuestPage'
import ProfilePage from './mainPages/ProfilePage'
import QuestsPage from './mainPages/QuestsPage'
import RoutesPage from './mainPages/RoutesPage'
import SingleQuestPage from './mainPages/SingleQuestPage'
import SingleQuestRouteQuestPage from './mainPages/SingleQuestRouteQuestPage'
import SingleRoutePage from './mainPages/SingleRoutePage'

const geo_options = {
  enableHighAccuracy: true,
  maximumAge        : 10000,
  timeout           : 7000
};

export default function MainPage() {
  const dispatch = useAppDispatch();
  const {isSingIn} = useAppSelector(state => state.SignReducer);
  const {quests, error: errorQ, isLoading: isLoadQ} = useAppSelector(state => state.questReducer)
  const {questRoutes, error: errorQR, isLoading: isLoadQR} = useAppSelector(state => state.QuestRouteReducer)

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(async function(position) {
        if (isMobile) {
          dispatch(setUserPos([position.coords.latitude, position.coords.longitude]));  
        }
      }, () => {
        console.log('Geolocation inavailable');
      }, geo_options);
    } else {
      console.log('Geolocation inavailable!');
    }
  }, []);

  useEffect(() => {
    if (errorQ && isSingIn) {
      setTimeout(() => {
        dispatch(fetchQuest());
      }, 2500);
    }
  }, [errorQ, isLoadQ, isSingIn]);

  useEffect(() => {
    if (errorQR && isSingIn) {
      setTimeout(() => {
        dispatch(fetchQuestRoutes());
      }, 2500);
    }
  }, [errorQR, isLoadQR, isSingIn]);

  useEffect(() => {
    if (quests.count < 0 && isSingIn ) {
      dispatch(fetchQuest());
    }
    if (questRoutes.count < 0 && isSingIn) {
      dispatch(fetchQuestRoutes());
    }
  }, [isSingIn])

  useEffect(() => {
    if (isSingIn) {
      dispatch(fetchUser());
    }
  }, [isSingIn])

  if (!isSingIn) {
    return <AuthorizationPage></AuthorizationPage>
  }

  return (
    <>
    <div className="container">
      <Routes>
        <Route path='/quests' element={<QuestsPage />} />
        <Route path='/routes' element={<RoutesPage />} />
        <Route path='/myquests' element={<MyQuestPage />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/quests/:id' element={<SingleQuestPage />} />
        <Route path='/routes/:id' element={<SingleRoutePage />} />
        <Route path='/routes/:id/quests/:questId' element={<SingleQuestRouteQuestPage />} />
        <Route path='/admin/*' element={<AdminPage></AdminPage>}></Route>
        <Route path='*' element={<MapPage />} />
      </Routes>
    </div>
    
    <Navigation />
    </>
  )
}
