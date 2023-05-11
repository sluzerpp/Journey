import React from 'react'

export default function ButtonUI(props: {children?: React.ReactNode, callback: CallableFunction, className?: string}) {
  const DEFAULT_CLASSNAME = 'btn';
  const className = DEFAULT_CLASSNAME + ' ' + props.className;
  return (
    <button className={className} onClick={() => props.callback()}>{props.children}</button>
  )
}
