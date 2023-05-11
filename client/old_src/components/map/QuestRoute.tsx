import L, { icon, LatLng, Polyline, control } from 'leaflet';
import React from 'react'
import { useMap } from 'react-leaflet';
import { MarkerStatus } from '../../types/IMap';
import { IUserQuestRoute } from '../../types/IUser'
import { IdToQuest, IdToQuestRoute } from './Map'
import QuestMarker from './QuestMarker';
import 'leaflet-routing-machine'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import RoutingMachine from './Routing';
import CreateRoutingMachine from './Routing';

export default function QuestRoute(props: { route: IUserQuestRoute }) {
  const map = useMap();
  const { id, completedCount } = props.route;
  const QuestRoute = IdToQuestRoute(id);
  if (QuestRoute) {
    const quests = QuestRoute.quests.map((el) => IdToQuest(el));
    const completedQuests = quests.slice(0, completedCount);
    const availableQuest = quests.slice(completedCount, completedCount + 1);
    const unavailableQuests = quests.slice(completedCount + 1);

    for(let i = 0; i < quests.length; i++) {
      const start = quests[i]?.location;
      const end = quests[i + 1]?.location;
      if (start && end) {
        L.polyline([start, end], { className: "RouteLine" }).addTo(map);
      }
    }

    return (
      <>
        {
          completedQuests.map((el) => 
          el && <QuestMarker 
            key={el.id} 
            quest={el} 
            markerStatus={MarkerStatus.Completed}
          ></QuestMarker>)
        }
        {
          availableQuest.map((el) => 
          el && <QuestMarker 
            key={el.id} 
            quest={el} 
            markerStatus={MarkerStatus.Available}
          ></QuestMarker>)
        }
        {
          unavailableQuests.map((el) => 
          el && <QuestMarker 
            key={el.id} 
            quest={el} 
            markerStatus={MarkerStatus.Unavailable}
            disabled={true}
          ></QuestMarker>)
        }
      </>
    )
  }
  return (
    <></>
  )
}
