import { LatLngExpression } from 'leaflet';
import React, { useContext, useEffect, useState } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import MapMarkerSVG from '../../svg/MapMarkerSVG';
import { isMobile } from 'react-device-detect';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { setCenter, setIsPath, setPathTo, setZoom } from '../../../store/reducers/Actions/MapActionCreators';
import ButtonUI from '../../UI/ButtonUI';
import { IQuest, IUserQuest } from '../../../types/IQuest';
import L from 'leaflet';
import { toMarkerType } from '../../../util/transform';
import { Coordinate, Status } from '../../../types/IMap';
import { IQuestRouteQuest } from '../../../types/IQuestRoute';
import { updateQuestRouteStatus, updateQuestStatus } from '../../../store/reducers/Actions/QuestRouteActionCreators';
import { ClearMap, getBtnText } from './functions/functions';
import { useNavigate } from 'react-router-dom';
import { getDistanceBetweenPoints } from '../../../util/distance';
import { RADIUS } from '../modal/nearModal';
import useNear from '../../../hooks/useNear';
import Distance from '../../UI/distance';
import PawSVG from '../../../components/svg/pawSvg';
import useRouteQuestBtn from '../../../hooks/useRouteQuestBtn';

export default function QuestMarker(props: {quest: IQuestRouteQuest, route: { name: string, id: number, status: Status }, disabled?: boolean}) {
  const navigate = useNavigate();
  const map = useMap();
  const dispatch = useAppDispatch();
  const { quest, "user-quest": userQuest } = props.quest;
  const { latitude, longitude, type } = quest;
  const [questStatus, setQuestStatus] = useState(userQuest.state);

  const svgIcon = MapMarkerSVG({ questStatus, markertype: toMarkerType(type)});
  const imgPath = `${process.env.REACT_APP_API_URL}/${quest.thumbnail}`

  const {isNear, distance} = useNear([quest.latitude, quest.longitude]);

  function createPath() { 
    if (isMobile) {
      dispatch(setIsPath(true));
      dispatch(setPathTo([latitude, longitude]));
    }
  }

  function btnRouteStart() {
    const center = map.getCenter();
    const zoom = map.getZoom();
    dispatch(setZoom(zoom));
    dispatch(setCenter([center.lat, center.lng]));
    dispatch(updateQuestRouteStatus(props.route.id, Status.Accepted));
  }

  const {text, onClick} = useRouteQuestBtn(props.route.id, quest.id, questStatus, isNear)

  useEffect(() => {
    setQuestStatus(props.quest['user-quest'].state);
  }, [props])

  return (
    <Marker position={L.latLng(latitude, longitude)} icon={svgIcon}>
      {
      (quest['questRoute-quest'].order === 1 && props.route.status === Status.Available) ? 
      <Popup>
        <div className="popup popup--route">
          <div className="popup__type">Маршрут</div>
          <h2 className='popup__name'>{props.route.name}</h2>
          <ButtonUI callback={createPath} className={`path ${!isMobile && 'disabled'}`}><i className="uil uil-analysis"></i></ButtonUI>
          <ButtonUI callback={btnRouteStart} className='open-quest'>
            Начать
          </ButtonUI>
        </div> 
      </Popup> : 
      !props.disabled && <Popup>
          <div className="popup">
            <div className="popup__type">Маршрутный квест</div>
            <div className="popup__img">
              <img src={imgPath} alt={quest.name}>
              </img>
              {
                questStatus === Status.Completed &&
                <PawSVG className='item__paw'></PawSVG>
              }
            </div>
            <h2 className='popup__name'>{quest.name}</h2>
            <ButtonUI callback={createPath} className={`path ${!isMobile && 'disabled'}`}><i className="uil uil-analysis"></i></ButtonUI>
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
        </Popup> 
      }
    </Marker>
  );
}