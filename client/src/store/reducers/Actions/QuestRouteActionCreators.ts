import { AppDispatch } from "../..";
import { useAppSelector } from "../../../hooks/redux";
import { $authHost } from "../../../http";
import { Status } from "../../../types/IMap";
import { IUserQuestResponse } from "../../../types/IQuest";
import { IQuestRouteQuestResponse, IUserQuestRouteResponse } from "../../../types/IQuestRoute";
import { QuestResponse, QuestRouteSlice, QuestRoute_QuestsSlice } from "../QuestRouteSlice";
import {UpdateSlice} from "../UpdateSlice";
import { fetchQuest } from "./ActionCreators";
import { fetchUser } from "./UserActionCreators";

export const fetchQuestRoutes = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(QuestRouteSlice.actions.questsFetching());
    const response = await $authHost.get<IUserQuestRouteResponse>('/api/users/questroutes');
    dispatch(QuestRouteSlice.actions.questsFetchingSuccess(response.data));
    response.data.questRoutes.forEach(async (route) => {
       dispatch(fetchQuestRoute_quests(route.id));
    });
  } catch (e) {
    const error = e as Error;
    dispatch(QuestRouteSlice.actions.questsFetchingError(error.message));
  }
};

export const fetchQuestRoute_quests = (id: number) => async (dispatch: AppDispatch) => {
  try {
    dispatch(QuestRoute_QuestsSlice.actions.questsFetching());
    const response = await $authHost.get<IQuestRouteQuestResponse>(`/api/questroutes/${id}/quests`);
    dispatch(QuestRoute_QuestsSlice.actions.questsFetchingSuccess(response.data));
  } catch (e) {
    const error = e as Error;
    dispatch(QuestRoute_QuestsSlice.actions.questsFetchingError(error.message));
  }
}

export const updateQuestStatus = (questId: number, status: Status) => async (dispatch: AppDispatch) => {
  dispatch(updateDecorator(
    () => {
      $authHost.put(`/api/users/quests/${questId}`, {state: status});
    }
  ));
}

export const updateQuestRouteStatus = (questRouteId: number, status: Status) => async (dispatch: AppDispatch) => {
  dispatch(updateDecorator(
    () => {
      $authHost.put(`/api/users/questroutes/${questRouteId}`, {state: status});
    }
  ));
}

export const updateDecorator = (callback: CallableFunction) => async (dispatch: AppDispatch) => {
  try {
    dispatch(UpdateSlice.actions.setLoading(true));
    await callback();
    dispatch(UpdateSlice.actions.setLoading(false));
    setTimeout(() => {
      dispatch(fetchQuest());
      dispatch(fetchUser());
    }, 200)
  } catch (e) {
    const error = e as Error;
    dispatch(UpdateSlice.actions.setLoading(false));
    dispatch(UpdateSlice.actions.setError(error.message));
  }
}