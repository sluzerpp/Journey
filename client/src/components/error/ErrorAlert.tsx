import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { hideError } from '../../store/reducers/Actions/Actions';

export default function ErrorAlert() {
  const {isError, message} = useAppSelector(state => state.errorReducer);
  const dispatch = useAppDispatch();
  const [timer, setTimer] = useState<NodeJS.Timeout>();
 
  useEffect(() => {
    if (isError) {
      setTimer(setTimeout(() => {
        dispatch(hideError());
      }, 3000))
    }
  }, [isError])

  const onErrorClick = () => {
    clearTimeout(timer);
    dispatch(hideError());
  }

  return (
    <div onClick={onErrorClick} className={`error-alert ${ isError ? 'show' : ''}`}>{message}<span className='error-alert__close'><i className="uil uil-multiply"></i></span></div>
  )
}
