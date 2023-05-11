import React, { useEffect, useRef, useState } from 'react'
import ButtonUI from '../../components/UI/ButtonUI';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import PawSVG from '../../components/svg/pawSvg';
import Modal from '../../components/Modal/Modal';
import ModalHeader from '../../components/Modal/ModalHeader';
import { useFileValidate, useValidate } from '../../hooks/useValidate';
import { isImageFile, isNotEmpty } from '../../util/validation';
import { useNavigate } from 'react-router-dom';
import { $authHost } from '../../http';
import { showError } from '../../store/reducers/Actions/Actions';
import { fetchUser } from '../../store/reducers/Actions/UserActionCreators';
import { HOST } from '../../components/quests/QuestListItem';

type UpdateState = {
  isChange: boolean,
  message: string,
}

type UpdateAnswer = {
  nickname: UpdateState,
  password: UpdateState,
  avatar: UpdateState,
}

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const {user} = useAppSelector(state => state.UserReducer);
  const [imgUrl, setImgUrl] = useState(user.avatar); 
  const [isModal, setIsModal] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [resetText, setResetText] = useState('Сбросить');
  const [resetState, setResetState] = useState(false);
  const navigate = useNavigate();

  const nicknameRef = useRef<HTMLInputElement>(null);
  const oldPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const avatarRef = useRef<HTMLInputElement>(null);

  const {input: nicknameInput, isValid: isNicknameValid } = useValidate(nicknameRef, isNotEmpty, '');
  const {input: oldPasswordInput, isValid: isOldPasswordValid } = useValidate(oldPasswordRef, isNotEmpty, '');
  const {input: newPasswordInput, isValid: isNewPasswordValid } = useValidate(newPasswordRef, isNotEmpty, '');
  const {file, preview, onChange: onFileChange, isValid: isFileValid} = useFileValidate(avatarRef, isImageFile);

  useEffect(() => {
    setImgUrl(user.avatar);
  }, [user.avatar])

  const toggleModal = () => {
    setIsModal(prev => !prev);
  }

  const changeNickname = async () => {
    if (isNicknameValid()) {
      const formData = new FormData();
      formData.append('nickname', nicknameInput.value);
      const response = await $authHost.put<UpdateAnswer>('api/users', formData);
      const {nickname} = response.data;
      if (!nickname.isChange) {
        dispatch(showError('Никнейм не был изменён!'));
      } else {
        if (!isSuccess) {
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
          }, 2500)
        }
      }
    }
    dispatch(fetchUser());
  }

  const changePassword = async (e: React.MouseEvent) => {
    if (isOldPasswordValid() && isNewPasswordValid()) {
      const formData = new FormData();
      formData.append('oldPassword', oldPasswordInput.value);
      formData.append('newPassword', newPasswordInput.value);
      const response = await $authHost.put<UpdateAnswer>('api/users', formData);
      const {password} = response.data;
      if (!password.isChange) {
        if (password.message) {
          dispatch(showError(password.message));
        } else {
          dispatch(showError('Пароль не был изменён!'));
        }
      } else {
        if (!isSuccess) {
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
          }, 2500)
        }
      }
    }
  }

  const changeAvatar = async (e: React.MouseEvent) => {
    if (isFileValid() && file) {
      const formData = new FormData();
      formData.append('avatar', file, file.name);
      const response = await $authHost.put<UpdateAnswer>('api/users', formData);
      const {avatar} = response.data;
      if (!avatar.isChange) {
        dispatch(showError('Аватар не был изменён!'));
      } else {
        if (!isSuccess) {
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
          }, 2500)
        }
      }
    }
    dispatch(fetchUser());
  }

  const navigateToAdmin = () => {
    navigate('/admin');
  }

  const signOutBtnHandler = () => {
    localStorage.removeItem('token');
    window.location.reload();
  }

  const resetProgress = async () => {
    if (!resetState) {
      setResetText('Вы уверены?');
      setResetState(true);
      setTimeout(() => {
        setResetState(false);
        setResetText('Сбросить');
      }, 10000);
    } else {
      try {
        const res = await $authHost.put(`${HOST}/api/users/reset`);
        if (res.status === 200) {
          setResetState(false);
          setResetText('Сброшено!');
          setTimeout(() => {
            signOutBtnHandler();
          }, 2000);
        } else {
          setResetText('Ошибка');
        }
      } catch (e) {
        setResetText('Ошибка');
      }
    }
  };

  return (
    <>
      <div className='profile'>
        <div className="profile__block">
          <div className="profile__img" style={{backgroundImage: `url(${process.env.REACT_APP_API_URL + `/` + imgUrl})`}}>
          </div>
        </div>
        <div className="profile__block">
          <div className="profile__text">
            <div className="profile__text-name">Никнейм</div>
            <div className="profile__text-value">{user.nickname}</div>
          </div>
          <div className="profile__text">
            <div className="profile__text-name">Роль</div>
            <div className="profile__text-value">{user.role}</div>
          </div>
        </div>
        {/* <div className="profile__block profile__block--two-columns">
            <div className="profile__text">
              <div className="profile__text-name">Лапки - </div>
              <div className="profile__text-value">{user.coins} <PawSVG className='profile__paw'></PawSVG></div>
            </div>
            <ButtonUI callback={() => []} className='profile__btn'>Магазин</ButtonUI>
        </div> */}
        <div className="profile__block">
          <div className="profile__text">
            <div className="profile__text-name">Опыт</div>
            <div className="profile__text-value">{`${user.currentExperience}/${user.experienceNextLevel}`}</div>
          </div>
          <div className="profile__text">
            <div className="profile__text-name">Уровень</div>
            <div className="profile__text-value">{user.level}</div>
          </div>
        </div>
        <div className="profile__block">
          <ButtonUI callback={toggleModal}>Настройки</ButtonUI>
          <ButtonUI callback={signOutBtnHandler} className={'danger'}>Выйти с аккаунта</ButtonUI>
        </div>
      </div>
      <div className={isModal  ? 'modal show' : 'modal'}>
        <div className="modal__bg" onClick={toggleModal}></div>
        <div className="modal__content">
          <ModalHeader title='Настройки' callback={toggleModal}></ModalHeader>
          <div className="modal__body">
            <div className={`success ${isSuccess ? 'show' : ''}` } onClick={() => setSuccess(false)}>Успешно изменено!</div>
            <div className="change__item">
              <h3>Сменить Никнейм</h3>
              <input ref={nicknameRef} className='input' {...nicknameInput} type='text' placeholder='Никнейм'></input>
              <ButtonUI callback={changeNickname}>Сменить Никнейм</ButtonUI>
            </div>
            <div className="change__item">
              <h3>Сменить Пароль</h3>
              <input ref={oldPasswordRef} className='input' {...oldPasswordInput} type='text' placeholder='Старый пароль'></input>
              <input ref={newPasswordRef} className='input' {...newPasswordInput} type='text' placeholder='Новый пароль'></input>
              <ButtonUI callback={changePassword}>Сменить Пароль</ButtonUI>
            </div>
            <div className="change__item">
            <h3>Сменить Аватар</h3>
              <input ref={avatarRef} className='input' type='file' onChange={onFileChange}></input>
              { file && preview && (file.type.includes('image')) && <div className='sign__preview mb-2' style={{backgroundImage: `url(${preview})`}}></div> }
              <ButtonUI callback={changeAvatar}>Сменить Аватар</ButtonUI>
            </div>
            <div className="change__item">
              <h3>Сбросить Прогресс</h3>
              <ButtonUI callback={resetProgress} className='danger'>{resetText}</ButtonUI>
            </div>
            {
              user.role === 'ADMIN' &&
              <div className="change__item">
                <h3>Админ-панель</h3>
                <ButtonUI callback={navigateToAdmin}>Перейти</ButtonUI>
              </div>
            }
          </div>
        </div>
      </div>
    </>
  )
}
