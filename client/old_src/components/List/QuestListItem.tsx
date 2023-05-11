import React from 'react'
import { IQuest } from '../../types/IQuests'

export default function QuestListItem({ quest }: { quest: IQuest }) {
  return (
    <>
      <div className="list__quest-item">
        <div className="quest-item__img">
          <img src={quest.thumbnail} alt={quest.name} />
        </div>
        <div className="quest-item__content">
          <div className="quest-item__title">{quest.name}</div>
          <div className="quest-item__description">{quest.description.text}</div>
        </div>
        <div className="quest-item__control"></div>
      </div>
    </>
  )
}
