import React, { useContext, useEffect } from 'react';
import MapState, { DEFAULT_POS, MapContext } from '../context/mapContext';
import { IQuest, IQuestsRoute } from '../types/IQuests';
import MapElem from '../components/map/Map';
import MapControl from '../components/map/MapControl/MapControl';

export default function MapPage(props: { quest?: IQuest, questRoute?: IQuestsRoute }) {
  
  return (
    <>
      <MapElem latlng={DEFAULT_POS}></MapElem>
    </>
  )
}
