import { HOST } from "../components/quests/QuestListItem";
import { $authHost } from "../http";
import { Difficult, IPuzzle } from "../types/IQuest"
import { createFormData } from "./quests"

export interface PuzzleData {
  difficult?: Difficult,
  questId?: number,
  image?: File
}

export const createPuzzle = async (data: PuzzleData) => {
  const formData = createFormData(data);
  const response = await $authHost.post<IPuzzle>(`${HOST}/api/puzzles/`, formData);
  return response.data;
}

export const updatePuzzle = async (id: number, data: PuzzleData) => {
  const formData = createFormData(data);
  const response = await $authHost.put<IPuzzle>(`${HOST}/api/puzzles/${id}`, formData);
  return response.data;
}

export const getAllPuzzles = async (questId?: number) => {
  const response = await $authHost.get<IPuzzle[]>(`${HOST}/api/puzzles${questId ? `?questId=${questId}` : ''}`);
  return response.data;
}

export const getOnePuzzle = async (id: number) => {
  const response = await $authHost.get<IPuzzle>(`${HOST}/api/puzzles/${id}`);
  return response.data;
}

export const deletePuzzle = async (id: number) => {
  const response = await $authHost.delete<IPuzzle>(`${HOST}/api/puzzles/${id}`);
  return response.data;
}