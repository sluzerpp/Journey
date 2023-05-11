import React, { useState } from 'react'
import { IImage } from '../../types/IQuest';

interface ImagesProps {
  thumbnail: string,
  images: IImage[]
}

const HOST = process.env.REACT_APP_API_URL;

export default function Images({thumbnail, images}: ImagesProps) {
  const [currentImg, setCurrentImg] = useState(thumbnail);
  const [active, setActive] = useState<Element>();

  const btnHandler = (e: React.MouseEvent) => {
    if(!(e.target instanceof HTMLElement)) return;
    if (!e.target.dataset.img) return;
    setCurrentImg(e.target.dataset.img);
    if (active) {
      active.classList.remove('active');
    }
    e.target.classList.add('active');
    setActive(e.target);
  }

  return (
    <div onClick={btnHandler} className="single__images">
      <div className="single__thumbnail" style={{backgroundImage: `url(${HOST}/${currentImg})`}}></div>
      <div className="single__variants">
        <div 
          className="single__variant"
          data-img={thumbnail}
          style={{backgroundImage: `url(${HOST}/${thumbnail})`}}
        ></div>
        {
          images.map(({image, id}) => {
            return <div 
              key={id}
              className="single__variant"
              data-img={image}
              style={{backgroundImage: `url(${HOST}/${image})`}}
            ></div>
          })
        }
      </div>
    </div>
  )
}
