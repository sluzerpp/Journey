import L, { icon, LatLng, Polyline, control } from 'leaflet';
import React, { useEffect, useState } from 'react'
import { useMap } from 'react-leaflet';
import QuestMarker from './QuestMarker';
import 'leaflet-routing-machine'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import { IQuestRouteQuest, IUserQuestRoute } from '../../../types/IQuestRoute';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { fetchQuestRoute_quests } from '../../../store/reducers/Actions/QuestRouteActionCreators';
import QuestMarkerQR from './QuestMarkerQR';
import useRouteQuests from '../../../hooks/useRouteQuests';
import { useRouteStatusVisibility } from '../../../hooks/useVisibility';
import { ClearMap } from './functions/functions';
import { Status } from '../../../types/IMap';
import { Route } from 'react-router-dom';


export default function QuestRoute({route}: { route: IUserQuestRoute }) {
  const {questResponses} = useAppSelector(state =>  state.QuestRoute_QuestsReducer);
  const {loading} = useAppSelector(state => state.updateReducer);

  const [questRes, setQuestRes] = useState(questResponses.find((el) => el.questRouteId === route.id));
  
  const questResponse = questRes?.questRes;

  const routeStatus = route['user-questRoute'].state;

  const isVisible = useRouteStatusVisibility(routeStatus);

  const map = useMap();
  const { completed } = route['user-questRoute'];
  
  const [completedQuests, setCompletedQuests] = useState<IQuestRouteQuest[]>();
  const [availableQuest, setAvailableQuests] = useState<IQuestRouteQuest[]>();
  const [unavailableQuests, setUnavailableQuests] = useState<IQuestRouteQuest[]>();
  const [group, setGroup] = useState<L.LayerGroup>();

  useEffect(() => {
    if (group) {
      group.removeFrom(map);
      setGroup(undefined);
    }
    if (isVisible && questResponse && questResponse.count > 0) {
      const { quests } = questResponse;
      setCompletedQuests(quests.slice(0, completed));
      setAvailableQuests(quests.slice(completed, completed + 1));
      setUnavailableQuests(quests.slice(completed + 1));

      const polylineGroup = new L.LayerGroup();

      for(let i = 0; i < quests.length - 1; i++) {
        const questItem1 = quests[i];
        const questItem2 = quests[i + 1];
        const start = {lat: questItem1.quest.latitude, lng: questItem1.quest.longitude};
        const end = {lat: questItem2.quest.latitude, lng: questItem2.quest.longitude};
        if (start && end) {
          const className = 'RouteLine' + (questItem2['user-quest'].state === Status.Unavailable ? ' RouteLine--red' : '');
          const line = L.polyline([L.latLng(start), L.latLng(end)], { className });
          polylineGroup.addLayer(line);
          polylineGroup.addTo(map);
        }
      }

      setGroup(polylineGroup);
    }
  }, [questRes, isVisible, loading])

  useEffect(() => {
    setQuestRes(questResponses.find((el) => el.questRouteId === route.id));
  }, [questResponses])

  useRouteQuests(route.id);

  return (
    isVisible && questResponse ? <>
      {
        completedQuests && completedQuests.map((el) => 
        el && <QuestMarkerQR 
          key={el.quest.id} 
          quest={el}
          route={{name: route.name, status: routeStatus, id: route.id}}
        ></QuestMarkerQR>)
      }
      {
        availableQuest && availableQuest.map((el) => 
        el && <QuestMarkerQR
          key={el.quest.id}
          quest={el}
          route={{name: route.name, status: routeStatus, id: route.id}}
        ></QuestMarkerQR>)
      }
      {
        unavailableQuests && unavailableQuests.map((el) => 
        el && <QuestMarkerQR 
          key={el.quest.id} 
          quest={el}
          route={{name: route.name, status: routeStatus, id: route.id}}
          disabled={true}
        ></QuestMarkerQR>)
      }
    </> : null
  )
}
