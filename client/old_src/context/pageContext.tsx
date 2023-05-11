import React, { createContext, useState } from 'react'
import Loading from '../components/loading/Loading';
import { IPageContext, IPageItem } from '../types/IPageContext';
import AuthorizationPage from '../pages/AuthorizationPage';
import MapPage from '../pages/MapPage';
import MyQuestPage from '../pages/MyQuestPage';
import QuestsPage from '../pages/QuestsPage';
import ProfilePage from '../pages/ProfilePage';
import RoutesPage from '../pages/RoutesPage';
import ShopPage from '../pages/ShopPage';
import SingleQuestPage from '../pages/SingleQuestPage';
import SingleRoutePage from '../pages/SingleRoutePage';
import { Map } from 'leaflet';
import { useMap } from 'react-leaflet';

const plug = () => {};

export const PageContext = createContext<IPageContext>({
  page: <MapPage></MapPage>,
  isLoading: true,
  setIsLoading: (val: Boolean) => {},
  openAuthorizationPage: plug,
  openMapPage: plug,
  openMyQuestsPage: plug,
  openQuestsPage: plug,
  openProfilePage: plug,
  openRoutesPage: plug,
  openShopPage: plug,
  openDetails: plug
});

export default function PageState({ children }: { children: React.ReactNode }) {
  const [page, setPage] = useState<React.ReactNode>(<MapPage></MapPage>);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const openAuthorizationPage = () => {
    setIsLoading(true);
    setPage(<AuthorizationPage></AuthorizationPage>)
  };
  const openMapPage = (item?: IPageItem) => {
    setIsLoading(true);
    if (!item || (item.quest && item.questRoute)) {
      setPage(<MapPage></MapPage>);
      return;
    }
    if (item.quest) {
      setPage(<MapPage quest={item.quest}></MapPage>)
    }
    if (item.questRoute) {
      setPage(<MapPage questRoute={item.questRoute}></MapPage>)
    }
  };
  const openMyQuestsPage = () => {
    setIsLoading(true);
    setPage(<MyQuestPage></MyQuestPage>)
  };
  const openQuestsPage = () => {
    setIsLoading(true);
    setPage(<QuestsPage></QuestsPage>)
  };
  const openProfilePage = () => {
    setIsLoading(true);
    setPage(<ProfilePage></ProfilePage>)
  };
  const openRoutesPage = () => {
    setIsLoading(true);
    setPage(<RoutesPage></RoutesPage>)
  };
  const openShopPage = () => {
    setIsLoading(true);
    setPage(<ShopPage></ShopPage>);
  };
  const openDetails = (item?: IPageItem) => {
    if (!item || (item.quest && item.questRoute)) return;
    setIsLoading(true);
    if (item.quest) {
      setPage(<SingleQuestPage quest={item.quest}></SingleQuestPage>)
    }
    if (item.questRoute) {
      setPage(<SingleRoutePage questRoute={item.questRoute}></SingleRoutePage>)
    }
  };

  return (
    <PageContext.Provider value={{  
      page,
      isLoading,
      setIsLoading,
      openAuthorizationPage,
      openMapPage,
      openMyQuestsPage,
      openQuestsPage,
      openProfilePage,
      openRoutesPage,
      openShopPage,
      openDetails,
    }}
    >
      {children}
    </PageContext.Provider>
  )
}
