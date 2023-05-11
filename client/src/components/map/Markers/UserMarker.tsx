import L from "leaflet";
import React, { useContext, useEffect } from "react";
import { Marker, Popup } from "react-leaflet";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { setCenter, setIsCenter, setUserPos } from "../../../store/reducers/Actions/MapActionCreators";
import { DEFAULT_POS } from "../../../store/reducers/MapSlice";
import { isMobile } from "react-device-detect";
import UserMarkerSVG from "../../svg/UserMarkerSVG";


export default function UserMarker() {
  const {userPos} = useAppSelector(state => state.mapReducer);
  const svgIcon = UserMarkerSVG();

  return (
    isMobile && userPos ?
    <>
      <Marker position={L.latLng(userPos)} icon={svgIcon}>
      </Marker>
    </>
    : null
  );
}