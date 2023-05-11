import React, { memo } from 'react'
import { useAppSelector } from '../../../hooks/redux'
import QuestRoute from './QuestRoute';

export default function QuestRoutes() {
  const {questRoutes} = useAppSelector(state => state.QuestRouteReducer);

  return (
    <>
      {
        questRoutes.count > 0 &&
        questRoutes.questRoutes.map((route) => {
          return <QuestRoute key={route.id} route={route}></QuestRoute>
        })
      }
    </>
  )
}
