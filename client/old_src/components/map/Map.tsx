import L from 'leaflet';
import React, { useContext, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Tooltip, useMap } from 'react-leaflet'
import Control from 'react-leaflet-custom-control';
import MapState, { DEFAULT_POS, MapContext } from '../../context/mapContext';
import { questData, questRouteData } from '../../model/sourceData';
import { IQuest, IQuestsRoute } from '../../types/IQuests';
import Modal from '../Modal/Modal';
import MapControl from './MapControl/MapControl';
import Markers from './Markers';

function SetMapCenter(props: 
  { coords: {lat: number, lng: number}, zoom: number, isCenter: boolean, setIsCenter: CallableFunction }) {
  const map = useMap();
  if (props.isCenter) map.flyTo(props.coords, props.zoom);
  return null;
}

export function IdToQuest(num: number) {
  return questData.find((el: IQuest) => el.id === num);
}

export function IdToQuestRoute(num: number) {
  return questRouteData.find((el: IQuestsRoute) => el.id === num);
}

function MapElem(props: {latlng?: {lat: number, lng: number}}) {
  const [isModal, setIsModal] = useState(false);
  const [center, setCenter] = useState(DEFAULT_POS);
  const [isCenter, setIsCenter] = useState(false);
  const [zoom, setZoom] = useState(12);

  useEffect(()=> {
    if(props.latlng){
      setCenter(props.latlng);
    }
  }, [props.latlng]);

  useEffect(() => {
    setIsCenter(false);
  }, [isCenter])

  return (
    <MapContainer dragging={!isModal} center={center} zoom={zoom} style={{ width: '100%', height: '100%' }} scrollWheelZoom={false}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <SetMapCenter zoom={zoom} coords={center} isCenter={isCenter} setIsCenter={setIsCenter}></SetMapCenter>
      <MapState>
        <Modal isModal={isModal} setIsModal={setIsModal} title='Что есть рядом?'>
          
        </Modal>
        
        <Control position='bottomright'>
          <MapControl setZoom={setZoom} setCenter={setCenter} setIsCenter={setIsCenter} callback={() => setIsModal(true)}></MapControl>
        </Control>
        <Markers setCenter={setCenter}></Markers>
      </MapState>
    </MapContainer>
  ) 

  

}

export default MapElem;