import React from 'react'
import { useMap } from 'react-leaflet';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setIsModal } from '../../store/reducers/Actions/MapActionCreators';
import ButtonUI from '../UI/ButtonUI';
import ModalHeader from './ModalHeader';

export default function Modal(props: {title: string, children: React.ReactNode}) {
  const {isModal} = useAppSelector(state => state.mapReducer)
  const dispatch = useAppDispatch();
  const modalClass = isModal  ? 'modal show' : 'modal';
  const map = useMap();

  if (isModal) {
    map.dragging.disable();
    map.scrollWheelZoom.disable();
    map.doubleClickZoom.disable();
  } else {
    map.dragging.enable();
    map.scrollWheelZoom.enable();
    map.doubleClickZoom.enable();
  }
 
  const modalClose = () => {
    dispatch(setIsModal(false));
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
