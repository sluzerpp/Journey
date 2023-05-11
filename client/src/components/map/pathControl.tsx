import { Routing } from 'leaflet';
import React, { useEffect, useState } from 'react'
import { useMap } from 'react-leaflet';
import { useAppSelector } from '../../hooks/redux';
import CreateRoutingMachine from './Routing';

export type ControlProps = {
  control: Routing.Control | undefined,
  setControl: CallableFunction
}

export default function PathControl({control, setControl}: ControlProps) {
  const map = useMap();
  const {isPath, userPos, pathTo} = useAppSelector(state => state.mapReducer);
  useEffect(() => {
    if (map) {
      if (isPath) {
        const newControl = CreateRoutingMachine({start: userPos, end: pathTo});
        map.addControl(newControl);
        if (control) {
          map.removeControl(control);
        }
        setControl(newControl);
      } else {
        if (control) {
          map.removeControl(control);
        }
        setControl(undefined);
      }
    }
    
  }, [pathTo, isPath, userPos]);

  return (
    null
  )
}
