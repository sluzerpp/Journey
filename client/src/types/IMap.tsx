export enum MarkerType {
  Memorial = 'MEMORIAL',
  Museum = 'MUSEUM',
  Park = 'PARK',
  Galery = 'GALERY',
  Unknown = 'UNKNOWN'
  // Todo - ещё придумать
}

export enum Status {
  Unavailable = 'UNAVAILABLE',
  Available = 'AVAILABLE',
  Accepted = 'ACCEPTED',
  Completed = 'COMPLETED',
  Unknown = 'UNKNOWN'
}

export type Coordinate = [number, number];

export interface IMapState {
  center: Coordinate,
  zoom: number,
  userPos?: Coordinate,
  pathTo?: Coordinate,
  isPath: boolean,
  isModal: boolean,
  isCenter: boolean;
  nearModal: boolean;
  filterModal: boolean;
  infoModal: boolean;
  filter: IFilter,
}

export interface IFilter {
  showPark: boolean,
  showMuseum: boolean,
  showGalery: boolean,
  showMemorial: boolean,
  isQuests: boolean,
  isRoutes: boolean,
  showCompleted: boolean,
  showAccepted: boolean,
  showAvailable: boolean,
  showAcceptedRoute: boolean,
  showAvailableRoute: boolean,
  showCompletedRoute: boolean,
}