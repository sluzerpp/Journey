import { AppDispatch } from "../..";
import { Coordinate, IFilter } from "../../../types/IMap"
import {MapSlice} from "../MapSlice"

export const setCenter = (coord: Coordinate) => (dispatch: AppDispatch) => {
  dispatch(MapSlice.actions.setCenter(coord));
}
export const setIsPath = (bool: boolean) => (dispatch: AppDispatch) => {
  dispatch(MapSlice.actions.setIsPath(bool));
}
export const setIsModal = (bool: boolean) => (dispatch: AppDispatch) => {
  dispatch(MapSlice.actions.setModal(bool));
}
export const setIsCenter = (bool: boolean) => (dispatch: AppDispatch) => {
  dispatch(MapSlice.actions.setIsCenter(bool));
}
export const setPathTo = (coord: Coordinate) => (dispatch: AppDispatch) => {
  dispatch(MapSlice.actions.setPathTo(coord));
}
export const setUserPos = (coord: Coordinate) => (dispatch: AppDispatch) => {
  dispatch(MapSlice.actions.setUserPos(coord));
}
export const setZoom = (zoom: number) => (dispatch: AppDispatch) => {
  dispatch(MapSlice.actions.setZoom(zoom));
}
export const setNearModal = (bool: boolean) => (dispatch: AppDispatch) => {
  dispatch(MapSlice.actions.setNearModal(bool));
  dispatch(MapSlice.actions.setFilterModal(false));
  dispatch(MapSlice.actions.setInfoModal(false));
}
export const setFilterModal = (bool: boolean) => (dispatch: AppDispatch) => {
  dispatch(MapSlice.actions.setNearModal(false));
  dispatch(MapSlice.actions.setFilterModal(bool));
  dispatch(MapSlice.actions.setInfoModal(false));
}
export const setInfoModal = (bool: boolean) => (dispatch: AppDispatch) => {
  dispatch(MapSlice.actions.setNearModal(false));
  dispatch(MapSlice.actions.setFilterModal(false));
  dispatch(MapSlice.actions.setInfoModal(bool));
}
export const setFilter = (filter: IFilter) => (dispatch: AppDispatch) => {
  dispatch(MapSlice.actions.setFilter(filter));
}