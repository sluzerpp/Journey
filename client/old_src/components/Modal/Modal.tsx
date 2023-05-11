import React from 'react'
import ButtonUI from '../UI/ButtonUI';
import ModalHeader from './ModalHeader';

export default function Modal(props: {children: React.ReactNode, isModal: boolean, setIsModal: CallableFunction, title: string}) {
  const modalClass = props.isModal ? 'modal show' : 'modal';

  const modalClose = () => {
    props.setIsModal((prev:boolean) => !prev);
  }

  return (
    <div className={modalClass}>
      <div className="modal__bg" onClick={modalClose}></div>
      <div className="modal__content">
        <ModalHeader title={props.title} callback={modalClose}></ModalHeader>
        <div className="modal__body">
          {props.children}
        </div>
      </div>
    </div>
  )
}
