import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import LoginForm from '../authPages/LoginForm';
import RegForm from '../authPages/RegForm';
import PawSVG from '../../components/svg/pawSvg';
import { useState } from 'react';

export default function AuthorizationPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className='sign'>
      <div className='sign__inner'>
        <h2 className='sign__title mb-2'>{
          isLogin
          ? 'Авторизация'
          : 'Регистрация'
        } <PawSVG id='sign__paw'></PawSVG> </h2>
        { 
          isLogin
          ? <LoginForm></LoginForm>
          : <RegForm></RegForm>
        }
        { 
          isLogin
          ? <a className='sign__notice' onClick={() => setIsLogin(false)}>Нет аккаунта? Зарегистрируйся!</a>
          : <a className='sign__notice' onClick={() => setIsLogin(true)}>Есть аккаунт? Авторизируйся!</a>
        }
      </div>
    </div>
  )
}
