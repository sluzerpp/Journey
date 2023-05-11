import React from 'react'
import useRouteQuests from '../../hooks/useRouteQuests';
import { IUserQuest } from '../../types/IQuest';
import { IUserQuestRoute } from '../../types/IQuestRoute';
import QuestListItem from './QuestListItem';
import QuestListRouteitem from './QuestListRouteitem';

export default function QuestList({quests, routes}: {quests?: IUserQuest[], routes?: IUserQuestRoute[]}) {

  return (
    <div className='quests__list'>
      {quests && quests.map((el) => {
        return <QuestListItem key={el.id} quest={el}></QuestListItem>
      })}
      {routes && routes.map((el) => {
        return <QuestListRouteitem key={el.id} route={el}></QuestListRouteitem>
      }) }
    </div>
  )
}
