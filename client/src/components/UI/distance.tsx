import React from 'react'

export default function Distance({distance}: {distance: number}) {
  return (
    <div className="distance">
      {
        distance >= 1000 ?
        `${(distance/1000).toFixed(1)} км.` :
        `${distance} м.`
      }
    </div>
  )
}
