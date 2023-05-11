import React, { useContext } from 'react'
import { PageContext } from '../../context/pageContext'
import { ICallback, IPageItem, IPageItemCallback } from '../../types/IPageContext';
import { IQuest, IQuestsRoute } from '../../types/IQuests';

export default function Navigation() {
  const { 
    openMapPage,
    openAuthorizationPage,
    openDetails,
    openMyQuestsPage,
    openProfilePage,
    openQuestsPage,
    openRoutesPage,
    openShopPage, 
    setIsLoading
  } = useContext(PageContext);

  const btnHandler = (func: ICallback | IPageItemCallback) => {
    return function() {
      
      func();
    }
  }

  const btnMapHandler = btnHandler(openMapPage);
  const btnRoutesHandler = btnHandler(openRoutesPage);
  const btnMyQuestsHandler = btnHandler(openMyQuestsPage);
  const btnQuestsHandler = btnHandler(openQuestsPage);
  const btnProfileHandler = btnHandler(openProfilePage);

  return (
    <nav className="nav">
      <div className="nav__inner">
        <button onClick={btnMapHandler} className="nav__btn"><i className="nav__icon uil uil-map"></i> Карта</button>
        <button onClick={btnRoutesHandler} className="nav__btn"><i className="nav__icon uil uil-share-alt"></i> Маршруты</button>
        <button className="nav__btn"><i className="nav__icon uil uil-book-alt"></i> Мои задания</button>
        <button className="nav__btn"><i className="nav__icon uil uil-clipboard-notes"></i> Задания</button>
        <button className="nav__btn"><i className="nav__icon uil uil-user"></i> Профиль</button>
      </div>
    </nav>
  )
}
