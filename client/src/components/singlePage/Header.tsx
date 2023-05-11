import React from 'react'
import Distance from '../UI/distance'

interface IProps {
  type: string,
  title: string,
  distance: number,
}

export default function SingleHeader({type, title, distance}: IProps) {
  return (
    <>
      <div className="single__two-columns">
        <div className="single__type">{type}</div>
        {
          distance !== 0 &&
          <div className="single__distance">
            <Distance distance={distance}></Distance>
          </div>
        }
      </div>
      <div className="single__title">{title}</div>
    </>
  )
}
