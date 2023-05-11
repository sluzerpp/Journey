import React, { createContext, useEffect, useState } from 'react'
import { Map, Routing } from 'leaflet';
import { useMap } from 'react-leaflet';
import { IMapContext } from '../types/IMapContext';
import CreateRoutingMachine from '../components/map/Routing';
import { isMobile } from 'react-device-detect';
import { SortType } from '../types/IFilter';

const plug = () => {};

export const DEFAULT_POS = {lat: 52.11867047103735, lng: 26.085083083538713};
export const MapContext = createContext<IMapContext>({
  pathTo: DEFAULT_POS,
  userPos: DEFAULT_POS,
  isPath: false,
  isMob: isMobile,
  prevControl: null,
  filter: {
    sort: SortType.ASC,
    setSort: plug,
    isAvailableQuests: true,
    setIsAvailableQuests: plug,
    isUnavailableQuests: true,
    setIsUnavailableQuests: plug,
    isAcceptedQuests: true,
    setIsAcceptedQuests: plug,
    isCompletedQuests: true,
    setIsCompletedQuests: plug,
    isQuest: true,
    setIsQuest: plug,
    isQuestRoute: true,
    setIsQuestRoute: plug,
    isAvailableQuestRoutes: true,
    setIsAvailableQuestRoutes: plug,
    isUnavailableQuestRoutes: true,
    setIsUnavailableQuestRoutes: plug,
    isAcceptedQuestRoutes: true,
    setIsAcceptedQuestRoutes: plug,
    isCompletedQuestRoutes: true,
    setIsCompletedQuestRoutes: plug,
  }
});

export default function MapState({ children }: { children: React.ReactNode }) {
  const map = useMap();

  const [userPos, setUserPos] = useState<{lat: number, lng: number}>(DEFAULT_POS);
  const [pathTo, setPathTo] = useState<{lat: number, lng: number}>(DEFAULT_POS);
  const [isPath, setIsPath] = useState<boolean>(false);
  const [prevControl, setPrevControl] = useState<Routing.Control | null>(null);

  const [sort, setSort] = useState(SortType.ASC);
  const [isAvailableQuests, setIsAvailableQuests] = useState(true);
  const [isUnavailableQuests, setIsUnavailableQuests] = useState(true);
  const [isAcceptedQuests, setIsAcceptedQuests] = useState(true);
  const [isCompletedQuests, setIsCompletedQuests] = useState(true);
  const [isQuest, setIsQuest] = useState(true);
  const [isQuestRoute, setIsQuestRoute] = useState(true);
  const [isAvailableQuestRoutes, setIsAvailableQuestRoutes] = useState(true);
  const [isUnavailableQuestRoutes, setIsUnavailableQuestRoutes] = useState(true);
  const [isAcceptedQuestRoutes, setIsAcceptedQuestRoutes] = useState(true);
  const [isCompletedQuestRoutes, setIsCompletedQuestRoutes] = useState(true);

  useEffect(() => {
    if (map) {
      if (isPath) {
        const control = CreateRoutingMachine({start: userPos, end: pathTo});
        map.addControl(control);
        if (prevControl) {
          map.removeControl(prevControl);
        }
        setPrevControl(control);
      } else {
        if (prevControl) {
          map.removeControl(prevControl);
        }
        setPrevControl(null);
      }
    }
    
  }, [pathTo, isPath, userPos]);

  if (map) {
    map.scrollWheelZoom.enable();
  }

  return (
    <MapContext.Provider value={{  
      userPos,
      setUserPos,
      pathTo,
      setPathTo,
      isPath,
      setIsPath,
      isMob: isMobile,
      prevControl,
      setPrevControl,
      filter: {
        sort,
        setSort,
        isAvailableQuests,
        setIsAvailableQuests,
        isUnavailableQuests,
        setIsUnavailableQuests,
        isAcceptedQuests,
        setIsAcceptedQuests,
        isCompletedQuests,
        setIsCompletedQuests,
        isQuest,
        setIsQuest,
        isQuestRoute,
        setIsQuestRoute,
        isAvailableQuestRoutes,
        setIsAvailableQuestRoutes,
        isUnavailableQuestRoutes,
        setIsUnavailableQuestRoutes,
        isAcceptedQuestRoutes,
        setIsAcceptedQuestRoutes,
        isCompletedQuestRoutes,
        setIsCompletedQuestRoutes,
      }
    }}
    >
      {children}
    </MapContext.Provider>
  )
}
