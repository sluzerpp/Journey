import React, { useEffect, useState } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import MapMarkerSVG from '../../svg/MapMarkerSVG';
import { isMobile } from 'react-device-detect';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { setCenter, setIsPath, setPathTo } from '../../../store/reducers/Actions/MapActionCreators';
import ButtonUI from '../../UI/ButtonUI';
import { IUserQuest } from '../../../types/IQuest';
import L from 'leaflet';
import { toMarkerType } from '../../../util/transform';
import { Coordinate, Status } from '../../../types/IMap';
import { updateQuestStatus } from '../../../store/reducers/Actions/QuestRouteActionCreators';
import { getDistanceBetweenPoints } from '../../../util/distance';
import { RADIUS } from '../modal/nearModal';
import { ClearMap, getBtnText } from './functions/functions';
import { useNavigate } from 'react-router-dom';
import { useVisiblity } from '../../../hooks/useVisibility';
import useQuestBtn from "../../../hooks/useQuestBtn";
import useNear from "../../../hooks/useNear";
import Distance from "../../UI/distance";
import PawSVG from '../../../components/svg/pawSvg';

export default function QuestMarker(props: {quest: IUserQuest, disabled?: boolean}) {
  const dispatch = useAppDispatch();
  const {userPos} = useAppSelector(state => state.mapReducer);
  const { quest } = props;
  const { latitude, longitude, type } = quest;

  const questStatus = quest['user-quest'].state || Status.Unknown;

  const svgIcon = MapMarkerSVG({ questStatus, markertype: toMarkerType(type)});
  const imgPath = `${process.env.REACT_APP_API_URL}/${quest.thumbnail}`

  const {isNear, distance} = useNear([quest.latitude, quest.longitude]);

  function createPath() { 
    if (isMobile) {
      dispatch(setIsPath(true));
      dispatch(setPathTo([latitude, longitude]));
    }
  }

  const {onClick, text} = useQuestBtn(quest.id, questStatus, isNear);

  return (
    useVisiblity(questStatus, toMarkerType(type)) ? 
    <Marker position={L.latLng(latitude, longitude)} icon={svgIcon}>
      { !props.disabled && <Popup>
        <div className="popup">
          <div className="popup__type">Одиночный квест</div>
          <div className="popup__img">
            <img src={imgPath} alt={props.quest.name}>
            </img>
            {
              questStatus === Status.Completed &&
              <PawSVG className='item__paw'></PawSVG>
            }
          </div>
          <h2 className='popup__name'>{props.quest.name}</h2>
          <ButtonUI callback={createPath} className={`path ${(!isMobile || !userPos) && 'disabled'}`}><i className="uil uil-analysis"></i></ButtonUI>
          <ButtonUI callback={onClick} className={`open-quest ${isNear && questStatus === Status.Accepted ? 'active' : ''}`}>
            { text }
          </ButtonUI>
          <div className="popup__footer">
            <div className="popup__experience">
              <i className="uil uil-star"></i>{quest.experience}
            </div>
            {
              distance &&
              <div className="popup__distance">
                <Distance distance={distance}></Distance>
              </div>
            }
          </div>
        </div> 
      </Popup> }
    </Marker> : null
  );
}