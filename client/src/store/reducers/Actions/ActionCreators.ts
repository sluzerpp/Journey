import { AppDispatch } from "../..";
import { $authHost } from "../../../http";
import { IQuestResponse, IUserQuestResponse } from "../../../types/IQuest";
import { QuestSlice } from "../QuestSlice";
import { fetchQuestRoutes } from "./QuestRouteActionCreators";

export const fetchQuest = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(QuestSlice.actions.questsFetching());
    const response = await $authHost.get<IUserQuestResponse>('/api/users/quests');
    dispatch(QuestSlice.actions.questsFetchingSuccess(response.data));
    dispatch(fetchQuestRoutes())
  } catch (e) {
    const error = e as Error;
    dispatch(QuestSlice.actions.questsFetchingError(error.message));
  }
};