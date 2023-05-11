import React from 'react'
import ButtonUI from '../UI/ButtonUI'

export default function ModalHeader({ title, callback }: { title: string, callback: CallableFunction }) {
  return (
    <div className="modal__header">
      <div className="modal__title">{title}</div>
      <ButtonUI className={'btn--close'} callback={callback}><i className="uil uil-multiply"></i></ButtonUI>
    </div>
  )
}
