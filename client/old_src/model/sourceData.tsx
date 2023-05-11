import { MarkerType } from "../types/IMap";
import { IQuest, IQuestsRoute } from "../types/IQuests";
import { IUser } from "../types/IUser";

export const user: IUser = {
  id: 12312,
  nickname: 'Sluzer',
  experience: 500,
  quests: {
    completed: [1],
    accepted: [4],
  },
  questRoutes: [{
      id: 1,
      completedCount: 1
    }]
};

export const questData: IQuest[] = [
  {
    id: 1,
    name: 'Quest 1',
    description: {
      facts: [ 'fact 1', 'fact 2' ],
      text: 'some text'
    },
    experience: 30,
    thumbnail: 'http://placekitten.com/g/120/135',
    images: ['http://placekitten.com/g/120/135', 'http://placekitten.com/g/120/135'],
    location: {
      lat: 52.346,
      lng: 26.0943
    },
    isRouteQuest: false,
    questType: MarkerType.Park
  },
  {
    id: 2,
    name: 'Quest 2',
    description: {
      facts: [ 'fact 1', 'fact 2' ],
      text: 'some text'
    },
    experience: 30,
    thumbnail: 'http://placekitten.com/g/120/135',
    images: ['http://placekitten.com/g/120/135', 'http://placekitten.com/g/120/135'],
    location: {
      lat: 51.2,
      lng: 26.543
    },
    isRouteQuest: true,
    questType: MarkerType.Museum
  },
  {
    id: 3,
    name: 'Quest 3',
    description: {
      facts: [ 'fact 1', 'fact 2' ],
      text: 'some text'
    },
    experience: 30,
    thumbnail: 'http://placekitten.com/g/120/135',
    images: ['http://placekitten.com/g/120/135', 'http://placekitten.com/g/120/135'],
    location: {
      lat: 51.1246,
      lng: 26
    },
    isRouteQuest: true,
    questType: MarkerType.Memorial
  },
  {
    id: 4,
    name: 'Quest 4',
    description: {
      facts: [ 'fact 1', 'fact 2' ],
      text: 'some text'
    },
    experience: 30,
    thumbnail: 'http://placekitten.com/g/120/135',
    images: ['http://placekitten.com/g/120/135', 'http://placekitten.com/g/120/135'],
    location: {
      lat: 51,
      lng: 26
    },
    isRouteQuest: false,
    questType: MarkerType.Galery
  },
  {
    id: 5,
    name: 'Quest 5',
    description: {
      facts: [ 'fact 1', 'fact 2' ],
      text: 'some text'
    },
    experience: 30,
    thumbnail: 'http://placekitten.com/g/120/135',
    images: ['http://placekitten.com/g/120/135', 'http://placekitten.com/g/120/135'],
    location: {
      lat: 51.20,
      lng: 26
    },
    isRouteQuest: true,
    questType: MarkerType.Memorial
  },
  {
    id: 6,
    name: 'Quest 6',
    description: {
      facts: [ 'fact 1', 'fact 2' ],
      text: 'some text'
    },
    experience: 30,
    thumbnail: 'http://placekitten.com/g/120/135',
    images: ['http://placekitten.com/g/120/135', 'http://placekitten.com/g/120/135'],
    location: {
      lat: 51.20,
      lng: 26.10
    },
    isRouteQuest: false,
    questType: MarkerType.Memorial
  }
];

export const questRouteData: IQuestsRoute[] = [
  {
    id: 1,
    name: 'Quest Route 1',
    quests: [2, 3, 5],
    experience: 100
  }
];
