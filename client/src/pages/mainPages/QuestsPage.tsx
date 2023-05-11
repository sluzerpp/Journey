import React from 'react'
import QuestList from '../../components/quests/QuestList'
import { useAppSelector } from '../../hooks/redux'

export default function QuestsPage() {
  const {quests} = useAppSelector(state => state.questReducer);

  return (
    <div className='quests'>
      <QuestList quests={quests.quests}></QuestList>
    </div>
  )
}