import { Map, Routing } from "leaflet"
import { IFilter } from "./IFilter"

export type IMapContext = {
  userPos: {
    lat: number
    lng: number,

  },
  setUserPos?: CallableFunction,
  pathTo: {
    lat: number
    lng: number,
  },
  setPathTo?: CallableFunction,
  isPath: boolean,
  setIsPath?: CallableFunction,
  isMob: boolean,
  prevControl: Routing.Control | null,
  setPrevControl?: CallableFunction,
  filter: IFilter
}