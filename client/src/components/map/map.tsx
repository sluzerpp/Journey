import { Routing } from 'leaflet';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, useMap, useMapEvent } from 'react-leaflet';
import Control from 'react-leaflet-custom-control';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setCenter, setFilterModal, setInfoModal, setIsCenter, setIsModal, setNearModal, setZoom } from '../../store/reducers/Actions/MapActionCreators';
import { Coordinate } from '../../types/IMap';
import Modal from '../Modal/Modal';
import MapBtn from './MapBtn';
import MapControl from './MapControl';
import Markers from './Markers/Markers';
import UserMarker from './Markers/UserMarker';
import FilterModal from './modal/filterModal';
import InfoModal from './modal/infoModal';
import NearModal from './modal/nearModal';
import PathControl from './pathControl';

function SetMapCenter(props: { coords: Coordinate, zoom: number, isCenter: boolean}) {
  const dispatch = useAppDispatch()
  const map = useMap();

  useMapEvent('dragend', () => {
    const center = map.getCenter();
    dispatch(setCenter([center.lat, center.lng]));
  })

  useMapEvent('zoomend', () => {
    dispatch(setZoom(map.getZoom()));
  })

  if (props.isCenter) map.flyTo(props.coords, props.zoom);
  
  useEffect(() => {
    dispatch(setIsCenter(false));
  })

  return null;
}

export default function Map() {
  const dispatch = useAppDispatch();
  const {center, zoom, isCenter, nearModal, filterModal, infoModal} = useAppSelector(state => state.mapReducer)
  const [control, setControl] = useState<Routing.Control>()

  function toggleInfoModal() {
    dispatch(setIsModal(true));
    dispatch(setInfoModal(true));
  }

  useEffect(() => {
    if (!localStorage.getItem('info')) {
      toggleInfoModal();
      localStorage.setItem('info', 'true');
    }
  }, []);

  return (
    <MapContainer center={center} zoom={zoom} style={{ width: '100%', height: '100%' }} scrollWheelZoom={true}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <SetMapCenter isCenter={isCenter} zoom={zoom} coords={center}></SetMapCenter>
      <PathControl control={control} setControl={setControl}></PathControl>
      <Control position='bottomright'>
        <MapControl control={control} setControl={setControl}></MapControl>
      </Control>
      <Control position='topright'>
        <MapBtn callback={toggleInfoModal} icon={<i className="uil uil-question"></i>}
          className='info-btn'></MapBtn>
      </Control>
      <Modal title={nearModal ? 'Что есть рядом?' : filterModal ? 'Что убрать?' : infoModal ? 'Полезно знать!' : ''}>
        {
          nearModal ?
          <NearModal></NearModal>
          : filterModal ?
          <FilterModal></FilterModal>
          : infoModal ?
          <InfoModal></InfoModal>
          : null
        }
      </Modal>
      <Markers></Markers>
      <UserMarker></UserMarker>
    </MapContainer>
  )
}
