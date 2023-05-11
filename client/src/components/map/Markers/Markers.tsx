import React, { memo } from 'react'
import { useAppSelector } from '../../../hooks/redux'
import QuestMarker from './QuestMarker';
import QuestRoutes from './QuestRoutes';

const MemoQuestMarker = memo(QuestMarker);

export default function Markers() {
  const {quests} = useAppSelector(state => state.questReducer);
  const {isQuests} = useAppSelector(state => state.mapReducer.filter);

  return (
    <>
      {isQuests && quests.quests.map(el => {
        return <MemoQuestMarker key={el.id} quest={el}></MemoQuestMarker>
      })}
      <QuestRoutes></QuestRoutes>
    </>
  )
}
