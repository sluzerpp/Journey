import React, { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect';
import { useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { getBtnText } from '../components/map/Markers/functions/functions';
import { setCenter } from '../store/reducers/Actions/MapActionCreators';
import { updateQuestStatus } from '../store/reducers/Actions/QuestRouteActionCreators';
import { Status } from '../types/IMap';
import { useAppDispatch } from './redux';

export default function useRouteQuestBtn(questRouteId: number,id: number, status: Status, isNear: boolean) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [text, setText] = useState(getBtnText(status, isNear));

  function onClick() {
    switch (status) {
      case Status.Available: {
        dispatch(updateQuestStatus(id, Status.Accepted));
        break;
      }
      case Status.Accepted: {
        if (isNear && isMobile) {
          navigate(`routes/${questRouteId}/quests/${id}`);
        }
        break;
      }
      case Status.Completed: {
        navigate(`routes/${questRouteId}/quests/${id}`);
        break;
      }
    }
  }

  useEffect(() => {
    setText(getBtnText(status, isNear));
  }, [isNear, status])
   

  return {onClick, text};
}
