export type IFilter = {
  sort: SortType;
  setSort: CallableFunction;
  isAvailableQuests: boolean;
  setIsAvailableQuests: CallableFunction
  isUnavailableQuests: boolean;
  setIsUnavailableQuests: CallableFunction;
  isAcceptedQuests: boolean;
  setIsAcceptedQuests: CallableFunction;
  isCompletedQuests: boolean;
  setIsCompletedQuests: CallableFunction;
  isQuest: boolean;
  setIsQuest: CallableFunction;
  isQuestRoute: boolean;
  setIsQuestRoute: CallableFunction;
  isAvailableQuestRoutes: boolean;
  setIsAvailableQuestRoutes: CallableFunction;
  isUnavailableQuestRoutes: boolean;
  setIsUnavailableQuestRoutes: CallableFunction;
  isAcceptedQuestRoutes: boolean;
  setIsAcceptedQuestRoutes: CallableFunction;
  isCompletedQuestRoutes: boolean;
  setIsCompletedQuestRoutes: CallableFunction;
}

export enum SortType {
  ASC = 'asc',
  DESC = 'desc'
}