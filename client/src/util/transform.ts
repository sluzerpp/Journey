import { MarkerType } from "../types/IMap"

export const toMarkerType = (type: string) => {
  switch (type) {
    case MarkerType.Galery: {
      return MarkerType.Galery;
    }
    case MarkerType.Memorial: {
      return MarkerType.Memorial;
    }
    case MarkerType.Museum: {
      return MarkerType.Museum;
    }
    case MarkerType.Park: {
      return MarkerType.Park;
    }
    default: {
      return MarkerType.Unknown;
    }
  }
}