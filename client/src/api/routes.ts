import { HOST } from "../components/quests/QuestListItem";
import { $authHost } from "../http"

export interface RouteQuestsData {
  id: number,
  "questRoute-quest": {
    order: number,
  }
}

export interface IAdminRouteData {
  id?: number,
  name?: string,
  experience?: number,
  latitude?: number,
  longitude?: number,
  quests?: RouteQuestsData[],
}

export const createRoute = async (data: IAdminRouteData) => {
  const response = await $authHost.post<IAdminRouteData>(`${HOST}/api/questroutes/`, data);
  return response.data;
}

export const getAllRoutes = async () => {
  const response = await $authHost.get<IAdminRouteData[]>(`${HOST}/api/questroutes`);
  return response.data;
}

export const updateRoute = async (id: number, data: IAdminRouteData) => {
  const response = await $authHost.put<IAdminRouteData>(`${HOST}/api/questroutes/${id}`, data);
  return response.data;
}

export const deleteRoute = async (id: number) => {
  const response = await $authHost.delete<IAdminRouteData>(`${HOST}/api/questroutes/${id}`)
  return response.data;
}