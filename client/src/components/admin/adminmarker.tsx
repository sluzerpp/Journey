import { LeafletEvent, LeafletMouseEvent } from 'leaflet'
import React, { useEffect } from 'react'
import { Marker, useMapEvent } from 'react-leaflet'
import { MarkerType, Status } from '../../types/IMap'
import MapMarkerSVG from '../svg/MapMarkerSVG'

export default function AdminMarker({callback, coord}: {callback: CallableFunction, coord?: L.LatLng}) {
  const icon = MapMarkerSVG({ questStatus: Status.Unavailable, markertype: MarkerType.Galery})

  useMapEvent('click', (e: LeafletMouseEvent) => {
    callback(e.latlng);
  })
  
  return (
    coord && coord.lat !== 0 && coord.lng !== 0 ?
    <Marker position={coord} icon={icon}>
    </Marker>
    : null
  )
}
