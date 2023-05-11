import { Status } from "./IMap"

export interface IQuestResponse {
  count: number,
  rows: IQuest[]
};

export interface IQuest {
  id: number,
  name: string,
  experience: number,
  thumbnail: string,
  description: string,
  isRouteQuest: boolean,
  latitude: number,
  longitude: number,
  type: QuestType,
  createdAt: string,
  updatedAt: string
};

export enum QuestType {
  PARK = 'PARK',
  MUSEUM = 'MUSEUM',
  GALERY = 'GALERY',
  MEMORIAL = 'MEMORIAL'
};

export interface IUserQuestResponse {
  count: number,
  quests: IUserQuest[]
}

export interface IQuestPart {
  id: number,
  name: string,
  experience: number,
  thumbnail: string,
  description: string,
  isRouteQuest: boolean,
  latitude: number,
  longitude: number,
  type: string,
  createdAt: string,
  updatedAt: string,
  images: IImage[],
  facts: IFact[],
  tests: ITest[],
  puzzles: IPuzzle[]
} 

export interface IUserQuest extends IQuestPart {
  'user-quest': {
      id: number,
      state: Status,
      createdAt: string,
      updatedAt: string,
      userId: number,
      questId: number
  },
}

export interface IImage {
  id: number,
  questId: number,
  image: string,
  createdAt: string,
  updatedAt: string,
}

export interface IFact {
  id: number,
  questId: number,
  fact: string,
  createdAt: string,
  updatedAt: string,
}

export interface IPuzzle {
  id: number,
  image: string,
  difficult: Difficult,
  questId: number,
  createdAt: string,
  updatedAt: string,
}

export enum Difficult {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export interface ITest {
  id: number,
  name: string,
  questId: number,
  createdAt: string,
  updatedAt: string,
  testQuestions: ITestQuestion[],
}

export interface ITestQuestion {
  id: number,
  question: string,
  answer: string,
  testId: string,
  createdAt: string,
  updatedAt: string,
}