import React, { Children } from 'react'

export default function MapBtn(props: { callback: () => void, className?: string, text?: string, icon: JSX.Element }) {
  const DEFAULT_CLASSNAME = 'map-btn';
  const className = DEFAULT_CLASSNAME + ' ' + props.className;
  return (
    <button className={className} onClick={props.callback}>
      {props.text} <span className='map-btn__icon'>{props.icon}</span>
    </button>
  )
}
