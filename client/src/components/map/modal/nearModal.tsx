import React from 'react'
import { useAppSelector } from '../../../hooks/redux'
import { Coordinate } from '../../../types/IMap';
import { getDistanceBetweenPoints } from '../../../util/distance';
import QuestList from '../../quests/QuestList';

export const RADIUS = Number(process.env.REACT_APP_USER_RADIUS) || 50;

export const NEAR_RADIUS = 2000

export default function NearModal() {
  const {quests} = useAppSelector(state => state.questReducer);
  const {questRoutes} = useAppSelector(state => state.QuestRouteReducer);
  const {userPos} = useAppSelector(state => state.mapReducer);

  const nearQuests = quests.quests.filter((el) => {
    const questCoord: Coordinate = [el.latitude, el.longitude];
    if (userPos) {
      const distance = getDistanceBetweenPoints(userPos, questCoord);
      if (distance <= NEAR_RADIUS) {
        return true;
      }
      return false;
    } else {
      return false;
    }
  });

  const nearRoutes = questRoutes.questRoutes.filter((el) => {
    const routeCoord: Coordinate = [el.latitude, el.longitude];
    if (userPos) {
      const distance = getDistanceBetweenPoints(userPos, routeCoord);
      if (distance <= NEAR_RADIUS) {
        return true;
      }
      return false;
    } else {
      return false;
    }
  });

  return (
    <QuestList quests={nearQuests} routes={nearRoutes}></QuestList>
  )
}
