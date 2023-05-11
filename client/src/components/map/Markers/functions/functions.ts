import { isMobile } from "react-device-detect";
import { Status } from "../../../../types/IMap";

export function getBtnText(status: Status, isNear: boolean) {
  switch (status) {
    case Status.Accepted: {
      if (isNear && isMobile) {
        return 'Выполнить!'
      }
      return 'В процессе';
    }
    case Status.Available: {
      return 'Начать';
    }
    case Status.Completed: {
      return 'Перейти';
    }
    case Status.Unavailable: {
      return 'Недоступно';
    }
    case Status.Unknown: {
      return 'Неизвестно';
    }
  }
}

export function ClearMap(map: L.Map) {
  map.eachLayer(function (layer) {
    map.removeLayer(layer);
  });
}