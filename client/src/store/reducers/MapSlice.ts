import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Coordinate, IFilter, IMapState } from "../../types/IMap";

export const DEFAULT_POS: Coordinate = [52.126111540323194, 26.099739074707035];


const initialState: IMapState = {
  center: DEFAULT_POS,
  zoom: 14,
  isPath: false,
  isModal: false,
  isCenter: false,
  nearModal: false,
  filterModal: false,
  infoModal: false,
  filter: {
    showPark: true,
    showMuseum: true,
    showGalery: true,
    showMemorial: true,
    isQuests: true,
    isRoutes: true,
    showCompleted: true,
    showAccepted: true,
    showAvailable: true,
    showAcceptedRoute: true,
    showAvailableRoute: true,
    showCompletedRoute: true,
  }
}

export const MapSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setCenter(state, action: PayloadAction<Coordinate>) {
      state.center = action.payload;
      state.isCenter = true;
    },
    setUserPos(state, action: PayloadAction<Coordinate>) {
      state.userPos = action.payload;
    },
    setPathTo(state, action: PayloadAction<Coordinate>) {
      state.pathTo = action.payload;
    },
    setIsPath(state, action: PayloadAction<boolean>) {
      state.isPath = action.payload;
    },
    setZoom(state, action: PayloadAction<number>) {
      state.zoom = action.payload;
    },
    setModal(state, action: PayloadAction<boolean>) {
      state.isModal = action.payload;
    },
    setIsCenter(state, action: PayloadAction<boolean>) {
      state.isCenter = action.payload;
    },
    setNearModal(state, action: PayloadAction<boolean>) {
      state.nearModal = action.payload;
    },
    setFilterModal(state, action: PayloadAction<boolean>) {
      state.filterModal = action.payload;
    },
    setInfoModal(state, action: PayloadAction<boolean>) {
      state.infoModal = action.payload;
    },
    setFilter(state, action: PayloadAction<IFilter>) {
      state.filter = action.payload;
    }
  }
});

export default MapSlice.reducer;