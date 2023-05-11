import React from 'react'
import { useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/redux';
import useNear from '../../hooks/useNear';
import useQuestBtn from '../../hooks/useQuestBtn';
import useRouteQuestBtn from '../../hooks/useRouteQuestBtn';
import { setCenter, setIsModal, setZoom } from '../../store/reducers/Actions/MapActionCreators';
import { Status } from '../../types/IMap';
import { IQuest, IUserQuest } from '../../types/IQuest'
import { IQuestRouteQuest } from '../../types/IQuestRoute';
import ButtonUI from '../UI/ButtonUI';
import Distance from '../UI/distance';
import PawSVG from '../../components/svg/pawSvg';

const HOST = process.env.REACT_APP_API_URL;

export default function QuestListRouteQuestItem({questData, routeId}: {questData: IQuestRouteQuest, routeId: number}) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  function findQuest() {
    dispatch(setCenter([questData.quest.latitude, questData.quest.longitude]));
    dispatch(setIsModal(false));
    navigate('/');
  }

  const questStatus = questData['user-quest'].state || Status.Unknown;

  const {isNear, distance} = useNear([questData.quest.latitude, questData.quest.longitude]);
  const {onClick, text} = useRouteQuestBtn(routeId, questData.quest.id, questStatus, isNear);

  return (
    <div className='quests__list-item'>
      <div className="item__image" style={{backgroundImage: `url("${HOST}/${questData.quest.thumbnail}")`}}>
        {
          questStatus === Status.Completed &&
          <PawSVG className='item__paw'></PawSVG>
        }
      </div>
      <div className="item__content">
        <div className="item__header">
          <div className="item__name">
            {questData.quest.name}
          </div>
        </div>
        <div className="item__body">
          <div className="item__controls">
            <ButtonUI callback={findQuest}><i className="uil uil-location-point"></i></ButtonUI>
            <ButtonUI
              callback={onClick}
              className={`item__btn 
                ${isNear && questStatus === Status.Accepted ? 'active' : ''}
                ${questStatus === Status.Unavailable ? 'disabled' : ''}
                `}
              >{text}</ButtonUI>
          </div>
          <div className="item__footer">
            <div className="item__experience">
              <i className="uil uil-star"></i>{questData.quest.experience}
            </div>
            {
              distance &&
              <div className="item__distance">
                <Distance distance={distance}></Distance>
              </div>
            }
          </div>
        </div>
      </div>  
    </div>
  )
}
