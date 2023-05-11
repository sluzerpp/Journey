import React from 'react'
import { IQuestsRoute } from '../../types/IQuests'
import { IdToQuest } from '../map/Map'

export default function RouteListItem({ route }: { route: IQuestsRoute }) {
  const quests = route.quests.map((quest) => IdToQuest(quest));

  return (
    <div className="list__route-item">
      <div className="route-item__images">
        { quests.map((quest) => {
          if (quest) {
            return (
              <div className="quest-item__img">
                <img src={quest.thumbnail} alt={quest.name} />
              </div>
            )
          }
          return null;
        }) }
      </div>
      <div className="route-item__content">
        <div className="quest-item__title">{route.name}</div>
      </div>
      <div className="quest-item__control"></div>
    </div>
  )
}
