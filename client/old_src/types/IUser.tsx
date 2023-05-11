import { IQuest, IQuestsRoute } from "./IQuests"

export type IUserQuestRoute = {
  id: number,
  completedCount: number
}

export type IUser = {
  id: number,
  nickname: string,
  experience: number,
  quests: {
    accepted: number[],
    completed: number[]
  }
  questRoutes: IUserQuestRoute[]
}
