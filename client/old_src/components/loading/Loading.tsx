import React from 'react'
import Paws from '../animation/PawsAnim/Paws'
import CatSVG from '../svg/CatSVG'

export default function Loading() {
  return (
    <div className='loading'>
      <h1 className='loading__title'>
        <CatSVG></CatSVG> 
        Journey
      </h1>
      <div className="loading__content">
        <Paws></Paws>
        <h1 className='loading__text'>Загрузка...</h1>
      </div>
      </div>
  )
}
