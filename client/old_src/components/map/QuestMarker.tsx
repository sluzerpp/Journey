import { LatLngExpression } from 'leaflet';
import React, { useContext } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import { MapContext } from '../../context/mapContext';
import { PageContext } from '../../context/pageContext';
import { MarkerStatus, MarkerType } from '../../types/IMap';
import { IQuest } from '../../types/IQuests';
import MapMarkerSVG from '../svg/MapMarkerSVG';
import ButtonUI from '../UI/ButtonUI';

export default function QuestMarker(props: {quest: IQuest, markerStatus: MarkerStatus, disabled?: boolean}) {
  const { markerStatus } = props; 
  const { location, questType } = props.quest;

  const { openProfilePage } = useContext(PageContext);
  const { pathTo, setPathTo, isPath, setIsPath, isMob} = useContext(MapContext);

  const svgIcon = MapMarkerSVG({markerStatus, markertype: questType});

  function createPath() {
    if (setIsPath && setPathTo && isMob) {
      setIsPath(() => true);
      setPathTo(location);
    }
  }

  return (
    <Marker position={location} icon={svgIcon}>
      { !props.disabled && <Popup>
        <div className="popup">
          <div className="popup__img">
            <img src={props.quest.thumbnail} alt={props.quest.name}></img>
          </div>
          <h2 className='popup__name'>{props.quest.name}</h2>
          <ButtonUI callback={createPath} className={`path ${!isMob && 'disabled'}`}><i className="uil uil-analysis"></i></ButtonUI>
          <ButtonUI callback={() => {}} className='open-quest'>Перейти</ButtonUI>
        </div> 
      </Popup> }
    </Marker>
  );
}