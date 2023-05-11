import React, { useState } from 'react'
import QuestList from '../../components/quests/QuestList';
import ButtonUI from '../../components/UI/ButtonUI';
import { useAppSelector } from '../../hooks/redux';
import { Status } from '../../types/IMap';

export default function MyQuestPage() {
  const [showCompleted, setShowCompleted] = useState(false);

  const {quests} = useAppSelector(state => state.questReducer);
  const {questRoutes} = useAppSelector(state => state.QuestRouteReducer);

  const acceptedQuest = quests.quests.filter((quest) => {
    return quest['user-quest'].state === Status.Accepted && !quest.isRouteQuest;
  })
  const completedQuests = quests.quests.filter((quest) => {
    return quest['user-quest'].state === Status.Completed && !quest.isRouteQuest;
  })

  const acceptedRoutes = questRoutes.questRoutes.filter((route) => {
    return route['user-questRoute'].state === Status.Accepted;
  });
  const completedRoutes = questRoutes.questRoutes.filter((route) => {
    return route['user-questRoute'].state === Status.Completed;
  });

  return (
    <div className="quests">
      <div className="quests__header">
        <ButtonUI callback={() => setShowCompleted(false)}>Текущие</ButtonUI>
        <ButtonUI callback={() => setShowCompleted(true)}>Выполненные</ButtonUI>
      </div>
      {
        showCompleted ?
        completedQuests.length === 0 && completedRoutes.length === 0 && <h3>Вы ещё ничего не выполнили...</h3>
        : acceptedQuest.length === 0 && acceptedRoutes.length === 0 && <h3>Вы ещё ничего не начали...</h3>
      }
      {
        showCompleted ?
        <QuestList quests={completedQuests} routes={completedRoutes}></QuestList> :
        <QuestList quests={acceptedQuest} routes={acceptedRoutes}></QuestList> 
      }
    </div>
  )
}
