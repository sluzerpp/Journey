import React, { useEffect, useRef } from 'react'
import { Navigate, redirect } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { useInput } from '../../hooks/useInput'
import { useValidate } from '../../hooks/useValidate';
import { showError, signIn } from '../../store/reducers/Actions/Actions';
import { fetchUserAuth } from '../../store/reducers/Actions/UserActionCreators';
import { isNotEmpty } from '../../util/validation';

export default function LoginForm() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const {input: emailInput, isValid: isEmailValid} = useValidate(emailRef, isNotEmpty, '');
  const {input: passwordInput, isValid: isPasswordValid} = useValidate(passwordRef, isNotEmpty, '');

  const dispatch = useAppDispatch();

  const {token, error, isLoading} = useAppSelector(state => state.UserTokenReducer);

  useEffect(() => {
    if (error && !isLoading) {
      dispatch(showError(error));
    }
  }, [error, isLoading])

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      dispatch(signIn());
    }
  })

  const onLoginBtnClick = async () => {
    const isDataValid = [isEmailValid(), isPasswordValid()].every(el => el);
    if (isDataValid && !isLoading) {
      await dispatch(fetchUserAuth({
        email: emailInput.value, password: passwordInput.value
      } ,'login'));
    } 
  }

  return (
    <div className='sign__login'>
      <input ref={emailRef} className='input' {...emailInput} type='text' placeholder='Email' />
      <input ref={passwordRef} className='input mb-1' {...passwordInput} type='password' placeholder='Пароль'></input>
      <button className='btn mb-2' onClick={onLoginBtnClick}>Войти</button>
    </div>
  )
}
