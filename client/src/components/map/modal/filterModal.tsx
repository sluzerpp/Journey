import React, { useEffect, useState } from 'react'
import { useMap } from 'react-leaflet';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux'
import { setFilter } from '../../../store/reducers/Actions/MapActionCreators';
import PawSVG from '../../svg/pawSvg';

export default function FilterModal() {
  const map = useMap();
  const dispatch = useAppDispatch();
  const {filter} = useAppSelector(state => state.mapReducer);
  const [isQuests, setIsQuests] = useState(filter.isQuests);
  const [showPark, setShowPark] = useState(filter.showPark);
  const [showMuseum, setShowMuseum] = useState(filter.showMuseum);
  const [showGalery, setShowGalery] = useState(filter.showGalery);
  const [showMemorial, setShowMemorial] = useState(filter.showMemorial);
  const [isRoutes, setIsRoutes] = useState(filter.isRoutes);
  const [showCompleted, setShowCompleted] = useState(filter.showCompleted);
  const [showAccepted, setShowAccepted] = useState(filter.showAccepted);
  const [showAvailable, setShowAvailable] = useState(filter.showAvailable);
  const [showAcceptedRoute, setShowAcceptedRoute] = useState(filter.showAcceptedRoute);
  const [showAvailableRoute, setShowAvailableRoute] = useState(filter.showAvailableRoute);
  const [showCompletedRoute, setShowCompletedRoute] = useState(filter.showCompletedRoute);
  const [isChange, setIsChange] = useState(false);

  useEffect(() => {
    if (isChange) {
      dispatch(setFilter({
          isQuests,
          showPark,
          showMuseum,
          showGalery,
          showMemorial,
          isRoutes,
          showCompleted,
          showAccepted,
          showAvailable,
          showAcceptedRoute,
          showAvailableRoute,
          showCompletedRoute,
      }));
      setIsChange(false);
    }
  }, [isChange])
  
  const createBtnHandler = (callback: CallableFunction) => (e: React.ChangeEvent<HTMLInputElement>) => {
    callback((prev: boolean) => !prev);
    setIsChange(true);
  }

  return (
    <>
      <div className="filter__block">
        <div className="filter__title">
          <div className="filter__input">
            <label className='filter__label'>
              <input id='1' checked={isQuests} type="checkbox" onChange={createBtnHandler(setIsQuests)}></input>
              <label htmlFor='1'><PawSVG className='filter__paw'></PawSVG></label>
              Квесты
            </label>
          </div>
        </div>
        <div className="filter__input">
          <label className='filter__label'>
            <input id='2' checked={showPark} type="checkbox" onChange={createBtnHandler(setShowPark)}></input>
            <label htmlFor='2'><PawSVG className='filter__paw'></PawSVG></label>
            Парки <div className='filter__color PARK'></div>
          </label>
        </div>
        <div className="filter__input">
          <label className='filter__label'>
            <input id='3' checked={showMuseum} type="checkbox" onChange={createBtnHandler(setShowMuseum)}></input>
            <label htmlFor='3'><PawSVG className='filter__paw'></PawSVG></label>
            Музеи <div className='filter__color MUSEUM'></div>
          </label>
        </div>
        <div className="filter__input">
          <label className='filter__label'>
            <input id='4' checked={showGalery} type="checkbox" onChange={createBtnHandler(setShowGalery)}></input>
            <label htmlFor='4'><PawSVG className='filter__paw'></PawSVG></label>
            Галереи <div className='filter__color GALERY'></div>
          </label>
        </div>
        <div className="filter__input">
          <label className='filter__label'>
            <input id='5' checked={showMemorial} type="checkbox" onChange={createBtnHandler(setShowMemorial)}></input>
            <label htmlFor='5'><PawSVG className='filter__paw'></PawSVG></label>
            Мемориал <div className='filter__color MEMORIAL'></div>
          </label>
        </div>
        <div className="filter__input">
          <label className='filter__label'>
            <input id='6' checked={showAvailable} type="checkbox" onChange={createBtnHandler(setShowAvailable)}></input>
            <label htmlFor='6'><PawSVG className='filter__paw'></PawSVG></label>
            Доступные
          </label>
        </div>
        <div className="filter__input">
          <label className='filter__label'>
            <input id='7' checked={showAccepted} type="checkbox" onChange={createBtnHandler(setShowAccepted)}></input>
            <label htmlFor='7'><PawSVG className='filter__paw'></PawSVG></label>
            Принятые
          </label>
        </div>
        <div className="filter__input">
          <label className='filter__label'>
            <input id='8' checked={showCompleted} type="checkbox" onChange={createBtnHandler(setShowCompleted)}></input>
            <label htmlFor='8'><PawSVG className='filter__paw'></PawSVG></label>
            Завершённые
          </label>
        </div>
      </div>

      <div className="filter__block">
        <div className="filter__title">
          <div className="filter__input">
            <label className='filter__label'>
              <input id='9' checked={isRoutes} type="checkbox" onChange={createBtnHandler(setIsRoutes)}></input>
              <label htmlFor='9'><PawSVG className='filter__paw'></PawSVG></label>
              Маршруты
            </label>
          </div>
        </div>
        <div className="filter__input">
          <label className='filter__label'>
            <input id='10' checked={showAvailableRoute} type="checkbox" onChange={createBtnHandler(setShowAvailableRoute)}></input>
            <label htmlFor='10'><PawSVG className='filter__paw'></PawSVG></label>
            Доступные
          </label>
        </div>
        <div className="filter__input">
          <label className='filter__label'>
            <input id='11' checked={showAcceptedRoute} type="checkbox" onChange={createBtnHandler(setShowAcceptedRoute)}></input>
            <label htmlFor='11'><PawSVG className='filter__paw'></PawSVG></label>
            Принятые
          </label>
        </div>
        <div className="filter__input">
          <label className='filter__label'>
            <input id='12' checked={showCompletedRoute} type="checkbox" onChange={createBtnHandler(setShowCompletedRoute)}></input>
            <label htmlFor='12'><PawSVG className='filter__paw'></PawSVG></label>
            Завершённые
          </label>
        </div>
      </div>

      
    </>
  )
}
