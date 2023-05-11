import { DivIcon } from 'leaflet';
import React from 'react'
import { useAppSelector } from '../../hooks/redux';
import { Status, MarkerType } from '../../types/IMap';

export default function UserMarkerSVG() {
  const {user} = useAppSelector(state => state.UserReducer)
  
  const defaultClass = 'map-marker'; 

  const svgIcon = new DivIcon({
    className: defaultClass,
    iconSize: [160 / 3, 160 / 3],
  });

  svgIcon.options.html = `
  <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <circle cx="80" cy="80" r="80" fill="#04BF7B"/>
  <mask id="mask0_107_10" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="11" y="11" width="138" height="138">
  <circle cx="80" cy="80" r="69" fill="white"/>
  </mask>
  <g mask="url(#mask0_107_10)">
  <rect width="160" height="160" fill="url(#pattern0)"/>
  </g>
  <defs>
  <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
  <use xlink:href="#image0_107_10" transform="matrix(0.00187144 0 0 0.00169907 -0.884863 -0.0657895)"/>
  </pattern>
  <image id="image0_107_10" width="1480" height="666" xlink:href="${process.env.REACT_APP_API_URL}/${user.avatar || 'map.jpg'}"/></defs>
  </svg>
  `;
  return svgIcon;
}
