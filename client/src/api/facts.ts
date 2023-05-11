import { HOST } from "../components/quests/QuestListItem"
import { $authHost } from "../http"
import { IFact } from "../types/IQuest";

export interface FactData {
  fact?: string,
  questId?: number,
}

export const createFact = async (data: FactData) => {
  const response = await $authHost.post<IFact>(`${HOST}/api/facts/`, data);
  return response.data;
}

export const getAllFacts = async (questId?: number) => {
  const response = await $authHost.get<IFact[]>(`${HOST}/api/facts${questId ? `?questId=${questId}` : ''}`);
  return response.data;
}

export const updateFact = async (id: number, data: FactData) => {
  const response = await $authHost.put<IFact>(`${HOST}/api/facts/${id}`, data);
  return response.data;
}

export const deleteFactReq = async (id: number) => {
  const response = await $authHost.delete<IFact>(`${HOST}/api/facts/${id}`);
  return response.data;
}