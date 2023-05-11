import { Status } from "../types/IMap";
import { useAppSelector } from "./redux";
import { MarkerType } from '../types/IMap';

export function useVisiblity(status: Status, type: MarkerType) {
  const isStatusVisible = useStatusVisibility(status);
  const isTypeVisible = useTypeVisibility(type);
  return isStatusVisible && isTypeVisible;
}

export function useStatusVisibility(status: Status) {
  const {
    showAccepted,
    showAvailable,
    showCompleted,
  } = useAppSelector(state => state.mapReducer.filter);

  let isVisible = false;

  switch (status) {
    case Status.Accepted: {
      isVisible = showAccepted;
      break;
    }
    case Status.Available: {
      isVisible = showAvailable;
      break;
    }
    case Status.Completed: {
      isVisible = showCompleted;
      break;
    }
    case Status.Unavailable: {
      isVisible = true;
      break;
    }
  }

  return isVisible;
}

export function useRouteStatusVisibility(status: Status) {
  const {
    showAcceptedRoute,
    showAvailableRoute,
    showCompletedRoute,
    isRoutes,
  } = useAppSelector(state => state.mapReducer.filter);

  if (!isRoutes) return false;

  let isVisible = false;

  switch (status) {
    case Status.Accepted: {
      isVisible = showAcceptedRoute;
      break;
    }
    case Status.Available: {
      isVisible = showAvailableRoute;
      break;
    }
    case Status.Completed: {
      isVisible = showCompletedRoute;
      break;
    }
    case Status.Unavailable: {
      isVisible = true;
      break;
    }
  }

  return isVisible;
}

export function useTypeVisibility(type: MarkerType) {
  const {
    showGalery,
    showMemorial,
    showMuseum,
    showPark,
  } = useAppSelector(state => state.mapReducer.filter);

  let isVisible = false;

  switch (type) {
    case MarkerType.Galery: {
      isVisible = showGalery;
      break;
    }
    case MarkerType.Museum: {
      isVisible = showMuseum;
      break;
    }
    case MarkerType.Memorial: {
      isVisible = showMemorial;
      break;
    }
    case MarkerType.Park: {
      isVisible = showPark;
      break;
    }
  }

  return isVisible;
}