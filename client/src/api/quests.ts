import { HOST } from "../components/quests/QuestListItem";
import { $authHost } from "../http";
import { MarkerType } from "../types/IMap"
import { IQuest } from "../types/IQuest";

export type QuestData = {
  name?: string, 
  experience?: number, 
  description?: string, 
  latitude?: number, 
  longitude?: number, 
  type?: MarkerType,
  thumbnail?: File
}

export const createFormData = (obj: Object) => {
  const formData = new FormData();
  for (let [key, value] of Object.entries(obj)) {
    if (typeof value === 'number') {
      value = String(value);
    }
    formData.append(`${key}`, value);
  }
  return formData;
}

export const createQuest = async (data: QuestData) => {
  const formData = createFormData(data);
  const response = await $authHost.post<IQuest>(`${HOST}/api/quests/`, formData);
  return response.data;
}

export const getAllQuests = async () => {
  const response = await $authHost.get<IQuest[]>(`${HOST}/api/quests/`);
  return response.data;
}

export const getOneQuest = async (id: number) => {
  const response = await $authHost.get<IQuest>(`${HOST}/api/quests/${id}`);
  return response.data;
}

export const updateQuest = async (id: number, data: QuestData) => {
  const formData = createFormData(data);
  const response = await $authHost.put<IQuest>(`${HOST}/api/quests/${id}`, formData);
  return response.data;
}

export const deleteQuest = async (id: number) => {
  const response = await $authHost.delete<IQuest>(`${HOST}/api/quests/${id}`);
  return response.data;
}