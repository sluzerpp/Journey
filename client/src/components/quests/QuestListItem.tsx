import React from 'react'
import { useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/redux';
import useNear from '../../hooks/useNear';
import useQuestBtn from '../../hooks/useQuestBtn';
import { setCenter, setIsModal, setZoom } from '../../store/reducers/Actions/MapActionCreators';
import { Status } from '../../types/IMap';
import { IQuest, IUserQuest } from '../../types/IQuest'
import ButtonUI from '../UI/ButtonUI';
import Distance from '../UI/distance';
import PawSVG from '../../components/svg/pawSvg';

export const HOST = process.env.REACT_APP_API_URL;

export default function QuestListItem({quest}: {quest: IUserQuest}) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  function findQuest() {
    dispatch(setCenter([quest.latitude, quest.longitude]));
    dispatch(setIsModal(false));
    navigate('/');
  }

  const questStatus = quest['user-quest'].state || Status.Unknown;

  const {isNear, distance} = useNear([quest.latitude, quest.longitude]);
  const {onClick, text} = useQuestBtn(quest.id, questStatus, isNear);

  return (
    <div className='quests__list-item'>
      <div className="item__image" style={{backgroundImage: `url("${HOST}/${quest.thumbnail}")`}}>
        {
          questStatus === Status.Completed &&
          <PawSVG className='item__paw'></PawSVG>
        }
      </div>
      <div className="item__content">
        <div className="item__header">
          <div className="item__name">
            {quest.name}
          </div>
        </div>
        <div className="item__body">
          <div className="item__controls">
            <ButtonUI callback={findQuest}><i className="uil uil-location-point"></i></ButtonUI>
            <ButtonUI callback={onClick} className={`item__btn ${isNear && questStatus === Status.Accepted ? 'active' : ''}`}>{text}</ButtonUI>
          </div>
          <div className="item__footer">
            <div className="item__experience">
              <i className="uil uil-star"></i>{quest.experience}
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
