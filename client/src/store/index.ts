import { combineReducers, configureStore } from '@reduxjs/toolkit';
import questReducer from '../store/reducers/QuestSlice';
import loadingReducer from '../store/reducers/LoadingSlice';
import {UserReducer, UserTokenReducer, SignReducer} from './reducers/UserSlices';
import errorReducer from '../store/reducers/ErrorSlice';
import mapReducer from '../store/reducers/MapSlice';
import {QuestRouteReducer, QuestRoute_QuestsReducer} from './reducers/QuestRouteSlice';
import updateReducer from './reducers/UpdateSlice';

const rootReducer = combineReducers({
  questReducer,
  loadingReducer,
  UserReducer,
  UserTokenReducer,
  SignReducer,
  errorReducer,
  mapReducer,
  QuestRouteReducer,
  QuestRoute_QuestsReducer,
  updateReducer
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
}

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
