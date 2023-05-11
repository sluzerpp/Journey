import { MarkerType } from "./IMap";

export type IQuest = {
  id: number,
  name: string,
  description: {
    facts: string[],
    text: string 
  }
  thumbnail: string,
  images: string[],
  location: {
    lat: number,
    lng: number
  }
  experience: number,
  isRouteQuest: boolean,
  questType: MarkerType
};

export type IQuestsRoute = {
  id: number,
  name: string,
  quests: number[],
  experience: number
};

export type ITest = {
  id: number,
  questions: Map<string, string>
}

export type IPuzzle = {
  id: number,
  difficult: Difficult,

}

export enum Difficult {
  Easy = 0,
  Medium = 1,
  Hard = 2
}