import { HOST } from "../components/quests/QuestListItem";
import { $authHost } from "../http";
import { IImage } from "../types/IQuest";
import { createFormData } from "./quests"

export interface QuestImageData {
  questId?: number,
  image?: File
}

export const createImage = async (data: QuestImageData) => {
  const formData = createFormData(data);
  const response = await $authHost.post<IImage>(`${HOST}/api/images/`, formData);
  return response.data;
}

export const getAllImages = async (questId?: number) => {
  const response = await $authHost.get<IImage[]>(`${HOST}/api/images${questId ? `?questId=${questId}` : ''}`);
  return response.data;
}

export const updateImage = async (id: number, questId: number) => {
  const response = await $authHost.put<IImage>(`${HOST}/api/images/${id}`, {questId});
  return response.data;
}

export const deleteImage = async (id: number) => {
  const response = await $authHost.delete<IImage>(`${HOST}/api/images/${id}`);
  return response.data;
}