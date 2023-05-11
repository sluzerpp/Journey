import { Coordinate } from "../types/IMap";

export function getDistanceBetweenPoints(
  [latitude1, longitude1]: Coordinate,
  [latitude2, longitude2]: Coordinate) {
  let theta = longitude1 - longitude2;
  let distance = 60 * 1.1515 * (180/Math.PI) * Math.acos(
      Math.sin(latitude1 * (Math.PI/180)) * Math.sin(latitude2 * (Math.PI/180)) + 
      Math.cos(latitude1 * (Math.PI/180)) * Math.cos(latitude2 * (Math.PI/180)) * Math.cos(theta * (Math.PI/180))
  );
  return Number((distance * 1.609344).toFixed(3)) * 1000;
}