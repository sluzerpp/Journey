import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IQuestResponse, IUserQuest, IUserQuestResponse } from "../../types/IQuest";

interface QuestState {
  quests: IUserQuestResponse;
  error: string;
  isLoading: boolean;
}

const initialState: QuestState = {
  quests: { count: -1, quests: [] },
  error: '',
  isLoading: false,
}

export const QuestSlice = createSlice({
  name: 'user-quest',
  initialState,
  reducers: {
    questsFetching(state) {
      state.isLoading = true;
    },
    questsFetchingSuccess(state, action: PayloadAction<IUserQuestResponse>) {
      state.isLoading = false;
      state.error = '';
      state.quests = action.payload;
    },
    questsFetchingError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    }
  }
});

export default QuestSlice.reducer;