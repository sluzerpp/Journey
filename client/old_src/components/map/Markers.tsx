import React, { useContext } from 'react'
import { MapContext } from '../../context/mapContext';
import { questData, user } from '../../model/sourceData';
import { MarkerStatus } from '../../types/IMap';
import { IdToQuest } from './Map';
import QuestMarker from './QuestMarker';
import QuestRoute from './QuestRoute';
import UserMarker from './UserMarker';

export default function Markers(props: { setCenter: CallableFunction }) {
  const { setCenter } = props;
  const { isMob } = useContext(MapContext);

  const completedQuest = user.quests.completed.map((el) => IdToQuest(el));
  const acceptedQuest = user.quests.accepted.map((el) => IdToQuest(el));
  const availableQuest = questData.filter((el) => {
    return !acceptedQuest.includes(el) && !completedQuest.includes(el) && !el.isRouteQuest;
  });
  const QuestRoutes = user.questRoutes.map((el) => <QuestRoute key={el.id} route={el}></QuestRoute>);

  return (
    <>
      { isMob && <UserMarker setCenter={setCenter}></UserMarker> }
      { completedQuest.map((el) => {
        if (el) {
          return <QuestMarker key={el.id} quest={el} markerStatus={MarkerStatus.Completed}></QuestMarker>
        }
        return null;
      }) }
      { acceptedQuest.map((el) => {
        if (el) {
          return <QuestMarker key={el.id} quest={el} markerStatus={MarkerStatus.Accepted}></QuestMarker>
        }
        return null;
      }) }
      { availableQuest.map((el) => {
        if (el) {
          return <QuestMarker key={el.id} quest={el} markerStatus={MarkerStatus.Available}></QuestMarker>
        }
        return null;
      }) }
      { QuestRoutes }
    </>
  )
}
