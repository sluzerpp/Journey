import { Control, Map } from 'leaflet';
import React, { useContext } from 'react'
import { useMap } from 'react-leaflet';
import { MapContext } from '../../../context/mapContext';
import MapBtn from '../MapBtn/MapBtn';

export default function MapControl(props: 
  { callback: CallableFunction, setCenter: CallableFunction, setZoom: CallableFunction, setIsCenter: CallableFunction}) {
  const { isPath, setIsPath, setPrevControl, prevControl, userPos, isMob } = useContext(MapContext);
  const map = useMap();
  return (

    isMob ?
    <>
      {
          isPath && 
          <MapBtn callback={() => {
            if (setIsPath && setPrevControl) {
              setIsPath(false);
              if (prevControl) map.removeControl(prevControl);
              setPrevControl(null);
            }
          }} icon={<><i className="uil uil-analysis"></i><i className="uil uil-multiply"></i></>}
          className='map-btn--two-icons' ></MapBtn>
        }
          <MapBtn
          callback={() => { props.setIsCenter(true); props.setCenter(userPos); props.setZoom(14); }}
            icon={<i className="uil uil-user-location"></i>}
          ></MapBtn>
        <MapBtn
          callback={() => props.callback()} 
          icon={<i className="uil uil-compass"></i>}
        ></MapBtn>
    </> : null
  ) 
}
