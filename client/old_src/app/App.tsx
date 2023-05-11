import React, { useState, useEffect, useContext } from 'react';
import PageState, { PageContext } from '../context/pageContext';
import Loading from '../components/loading/Loading';
import { Route, Routes } from 'react-router-dom';
import Navigation from '../components/navigation/Navigation';
import MapPage from '../pages/MapPage';
import SingleQuestPage from '../pages/SingleQuestPage';
import QuestsPage from '../pages/QuestsPage';
import RoutesPage from '../pages/RoutesPage';
import ProfilePage from '../pages/ProfilePage';
import SingleRoutePage from '../pages/SingleRoutePage';

function App() {
  const { page, isLoading, setIsLoading } = useContext(PageContext);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1750);
  }, [page, setIsLoading]);

  return (
    <div className="app">
      {isLoading && <Loading></Loading>}
      <div className="container">
        {page}
      </div>
      
      <Navigation />
    </div>
  );
}

export default App;
