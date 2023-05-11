import { useEffect } from "react";
import { fetchQuestRoute_quests } from "../store/reducers/Actions/QuestRouteActionCreators";
import { useAppDispatch, useAppSelector } from "./redux";

export default function useRouteQuests(id: number) {
  const dispatch = useAppDispatch();
  const {questRoutes} = useAppSelector(state => state.QuestRouteReducer)

  useEffect(() => {
    if (questRoutes.count <= 1) {
      dispatch(fetchQuestRoute_quests(id));
    }
  }, [questRoutes.count])

  useEffect(() => {
    dispatch(fetchQuestRoute_quests(id));
  }, [])
}