import React, { useContext, useEffect } from "react";
import { Marker, Popup } from "react-leaflet";
import { MapContext } from '../../context/mapContext';
import { MarkerStatus, MarkerType } from '../../types/IMap';
import MapMarkerSVG from '../svg/MapMarkerSVG';

export default function UserMarker(props: {setCenter: CallableFunction}) {
  const { setUserPos, userPos } = useContext(MapContext);

  const svgIcon = MapMarkerSVG({markerStatus: MarkerStatus.Available, markertype: MarkerType.Galery});

  function btnHandler() {
    if (setUserPos) {
      setUserPos({lat: 52, lng: 26 + Math.random()});
    }
  }

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(function(position) {
        if (setUserPos)
          setUserPos({lat: position.coords.latitude, lng: position.coords.longitude});
      });
    }
  }, []);

  return (
    <Marker position={userPos} icon={svgIcon}>
      <Popup>
        <button onClick={btnHandler}>Коорды</button>
      </Popup>
    </Marker>
  );
}