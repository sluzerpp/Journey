import { HOST } from "../components/quests/QuestListItem"
import { $authHost } from "../http"
import { ITest, ITestQuestion } from "../types/IQuest";

export interface TestData {
  name?: string,
  questId?: number,
  testQuestions?: TestQuestionData[]
}

export interface TestQuestionData {
  question?: string,
  answer?: string,
  testId?: number
}

export const createTest = async (data: TestData) => {
  const response = await $authHost.post<ITest>(`${HOST}/api/tests/`, data);
  return response.data;
}

export const updateTest = async (id: number, data: TestData) => {
  const response = await $authHost.put<ITest>(`${HOST}/api/tests/${id}`, data);
  return response.data;
}

export const getAllTests = async (questId?: number) => {
  const response = await $authHost.get<ITest[]>(`${HOST}/api/tests${questId ? `?questId=${questId}` : ''}`);
  return response.data;
}

export const getOneTest = async (id: number) => {
  const response = await $authHost.get<ITest>(`${HOST}/api/tests/${id}`);
  return response.data;
}

export const deleteTest = async (id: number) => {
  const response = await $authHost.delete<ITest>(`${HOST}/api/tests/${id}`);
  return response.data;
}

export const createTestQuestion = async (data: TestQuestionData) => {
  const response = await $authHost.post<ITestQuestion>(`${HOST}/api/testquestions`, data);
  return response.data;
}

export const updateTestQuestion = async (id: number, data: TestQuestionData) => {
  const response = await $authHost.put<ITestQuestion>(`${HOST}/api/testquestions/${id}`, data);
  return response.data;
}

export const deleteTestQuestion = async (id: number) => {
  const response = await $authHost.delete<ITestQuestion>(`${HOST}/api/testquestions/${id}`);
  return response.data;
}
