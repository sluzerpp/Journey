import { Status } from './IMap'
import { IFact, IImage, IQuestPart, IUserQuest, IUserQuestResponse, QuestType } from './IQuest'

export interface IUserQuestRouteResponse {
  count: number,
  questRoutes: IUserQuestRoute[],
}

export interface IUserQuestRoute {
  id: number,
  name: string,
  experience: number,
  createdAt: string,
  updatedAt: string,
  latitude: number,
  longitude: number,
  'user-questRoute': {
      id: number,
      state: Status,
      completed: number,
      createdAt: string,
      updatedAt: string,
      userId: number,
      questRouteId: number,
  }
}

export interface IQuestRouteQuestResponse {
  count: number,
  quests: IQuestRouteQuest[]
}

export interface IQuestRoutePart extends IQuestPart {
  'questRoute-quest': {
      id: number,
      createdAt: string,
      updatedAt: string,
      questRouteId: number,
      questId: number,
      order: number
  }
}

export interface IQuestRouteQuest {
  quest: IQuestRoutePart
  'user-quest': {
      id: number,
      state: Status,
      createdAt: number,
      updatedAt: number,
      userId: number,
      questId: number
  }
}