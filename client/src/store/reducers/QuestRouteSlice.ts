import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IQuestResponse, IUserQuest, IUserQuestResponse } from "../../types/IQuest";
import { IQuestRouteQuest, IQuestRouteQuestResponse, IUserQuestRoute, IUserQuestRouteResponse } from "../../types/IQuestRoute";

interface QuestRouteState {
  questRoutes: IUserQuestRouteResponse;
  error: string;
  isLoading: boolean;
}

const initialState: QuestRouteState = {
  questRoutes: { count: -1, questRoutes: [] },
  error: '',
  isLoading: false,
}

export const QuestRouteSlice = createSlice({
  name: 'user-questRoute',
  initialState,
  reducers: {
    questsFetching(state) {
      state.isLoading = true;
    },
    questsFetchingSuccess(state, action: PayloadAction<IUserQuestRouteResponse>) {
      state.isLoading = false;
      state.error = '';
      state.questRoutes = action.payload;
    },
    questsFetchingError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    }
  }
});

export const QuestRouteReducer = QuestRouteSlice.reducer;

export interface QuestResponse { 
  questRouteId: number,
  questRes: IQuestRouteQuestResponse 
}

interface QuestRoute_QuestsState {
  questResponses: QuestResponse[];
  error: string;
  isLoading: boolean;
}

const initialState2: QuestRoute_QuestsState = {
  questResponses: [],
  error: '',
  isLoading: false,
}

export const QuestRoute_QuestsSlice = createSlice({
  name: 'user-questRoute_quests',
  initialState: initialState2,
  reducers: {
    questsFetching(state) {
      state.isLoading = true;
    },
    questsFetchingSuccess(state, action: PayloadAction<IQuestRouteQuestResponse>) {
      state.isLoading = false;
      state.error = '';
      if (action.payload.count > 0) {
        action.payload.quests.sort((a, b) => a.quest["questRoute-quest"].order - b.quest["questRoute-quest"].order);
        const questRouteId = action.payload.quests[0].quest["questRoute-quest"].questRouteId;
        state.questResponses = state.questResponses.filter((el) => el.questRouteId !== questRouteId);
        state.questResponses.push({ questRouteId, questRes: action.payload });
      }
    },
    questsFetchingError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    }
  }
});

export const QuestRoute_QuestsReducer = QuestRoute_QuestsSlice.reducer;