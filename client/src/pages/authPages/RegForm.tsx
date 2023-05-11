import React, { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { useInput } from '../../hooks/useInput'
import { useFileValidate, useValidate } from '../../hooks/useValidate';
import { signIn } from '../../store/reducers/Actions/Actions';
import { fetchUserAuth } from '../../store/reducers/Actions/UserActionCreators';
import { isImageFile, isNotEmpty, isValidEmail } from '../../util/validation';
import PawSVG from '../../components/svg/pawSvg';

export default function RegForm() {
  const [isAvatar, setIsAvatar] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const nicknameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const avatarRef = useRef<HTMLInputElement>(null);

  const {input: nicknameInput, isValid: isNicknameValid } = useValidate(nicknameRef, isNotEmpty, '');
  const {input: emailInput, isValid: isEmailValid } = useValidate(emailRef, isValidEmail, '');
  const {input: passwordInput, isValid: isPasswordValid } = useValidate(passwordRef, isNotEmpty, '');
  const {file, onChange: onFileChange, isValid: isFileValid} = useFileValidate(avatarRef, isImageFile);

  const dispatch = useAppDispatch();

  const {token, error, isLoading} = useAppSelector(state => state.UserTokenReducer);

  const onRegBtnClick = async () => {
    const isValidData = [isNicknameValid(), isEmailValid(), isPasswordValid()].every(el => el);
    if (isValidData && !isLoading && (!isAvatar || isFileValid())) {
      const formData = new FormData();
      if (file) {
        formData.append('avatar', file, file.name);
      }
      formData.append('email', emailInput.value);
      formData.append('password', passwordInput.value);
      formData.append('nickname', nicknameInput.value);
      await dispatch(fetchUserAuth(formData , 'registration'));
    }
  }

  if (error) {
    console.log(error);
  }

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      dispatch(signIn());
    }
  })

  return (
    <div className='sign__reg'>
      <input ref={nicknameRef} className='input' {...nicknameInput} type='text' placeholder='Никнейм'></input>
      <input ref={emailRef} className='input' {...emailInput} type='text' placeholder='Email'></input>
      <input ref={passwordRef} className='input' {...passwordInput} type='text' placeholder='Пароль'></input>
      <label className="test__label">
        <input type="checkbox" name='variants' checked={isAvatar} onChange={() => {setIsAvatar(prev => !prev)}}/>
        <label><PawSVG className='test__paw'></PawSVG></label>
        Свой Аватар
      </label>
      {
        isAvatar &&
        <>
          <input ref={avatarRef} className='input' type='file' onChange={onFileChange}></input>
          { file && (file.type.includes('image')) && <div className='sign__preview' style={{backgroundImage: `url(${URL.createObjectURL(file)})`}}></div> }
        </>
      }
      <button className='btn mb-2' onClick={onRegBtnClick}>Зарегистрироваться</button>
    </div>
  )
}
