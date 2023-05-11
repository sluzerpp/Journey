import React from 'react'
import QuestList from '../../components/quests/QuestList'
import { useAppSelector } from '../../hooks/redux'
import useRouteQuests from '../../hooks/useRouteQuests';

export default function RoutesPage() {
  const {questRoutes} = useAppSelector(state => state.QuestRouteReducer);

  return (
    <div className='quests'>
      <QuestList routes={questRoutes.questRoutes}></QuestList>
    </div>
  )
}