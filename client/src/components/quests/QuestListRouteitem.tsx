import React, { useState } from 'react'
import { useAppSelector } from '../../hooks/redux';
import useRouteQuests from '../../hooks/useRouteQuests';
import { Status } from '../../types/IMap';
import { IUserQuestRoute } from '../../types/IQuestRoute'
import QuestListItem, { HOST } from './QuestListItem';
import QuestListRouteQuestItem from './QuestListRouteQuestItem';
import PawSVG from '../../components/svg/pawSvg';

export default function QuestListRouteitem({route}: {route: IUserQuestRoute}) {
  const [isVisible, setIsVisible] = useState(false);
  const {questResponses} = useAppSelector(state =>  state.QuestRoute_QuestsReducer);

  const questRes = questResponses.find((el) => el.questRouteId === route.id);
  
  const questResponse = questRes?.questRes;

  function dropBtnHandler(e: React.MouseEvent) {
    if (e.target instanceof Element) {
      e.target.classList.toggle('active');
    }
    setIsVisible(prev => !prev);
  }
  
  useRouteQuests(route.id);

  return (
    (questResponse && questResponse.quests.length > 0) ?
    <div className='quests__list-item quests__list-item--route'>
      <div className="item__header">
        <div className="item__name">
          {route.name}
        </div>
      </div>
      <div className="item__imgs">
        {
          route['user-questRoute'].state === Status.Completed &&
          <PawSVG className='item__paw'></PawSVG>
        }
        {
          questResponse.quests.map((quest) => {
            return <div
              key={quest.quest.id}
              className="item__img"
              style={{backgroundImage: `url(${HOST}/${quest.quest.thumbnail})`}}
            ></div>
          })
        }
      </div>
      <div className="item__experience item__experience--route">
          <i className="uil uil-star"></i>{route.experience}
        </div>
      <div className="dropdown">
        <button onClick={dropBtnHandler} className="dropbtn">Квесты <i className="uil uil-angle-down"></i></button>
        <div className={`dropdown-content ${isVisible ? 'show' : ''}`}>
          {
            questResponse &&
            questResponse.quests.map((el) => {
              return <QuestListRouteQuestItem key={el.quest.id} routeId={route.id} questData={el}></QuestListRouteQuestItem>
            })
          }
        </div>
      </div>
    </div> : null
  )
}
