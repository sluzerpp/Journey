import React, { useEffect, useState } from 'react'
import { RADIUS } from '../components/map/modal/nearModal';
import { Coordinate } from '../types/IMap';
import { getDistanceBetweenPoints } from '../util/distance';
import { useAppSelector } from './redux';

export default function useNear(coord: Coordinate) {
  const [isNear, setIsNear] = useState(false);
  const {userPos} = useAppSelector(state => state.mapReducer);
  const [distance, setDistance] = useState<number>();

  useEffect(() => {
    if (userPos) {
      const distance = getDistanceBetweenPoints(userPos, coord);
      if (distance <= RADIUS) {
        setIsNear(true);
      }
      setDistance(Number(distance.toFixed(3)));
    }
  }, [userPos]);

  return {isNear, distance};
}
