import React, { useEffect, useState } from 'react'
import { Routes, Route, useNavigate, Link } from 'react-router-dom'
import { getAllQuests } from '../../api/quests';
import { getAllRoutes, IAdminRouteData } from '../../api/routes';
import Modal from '../../components/Modal/Modal';
import ModalHeader from '../../components/Modal/ModalHeader';
import { useAppSelector } from '../../hooks/redux'
import { IQuest } from '../../types/IQuest';
import AdminNew from '../adminPages/AdminNew';
import AdminPuzzles from '../adminPages/AdminPuzzles';
import AdminQuests from '../adminPages/AdminQuests';
import AdminRoutes from '../adminPages/AdminRoutes';
import AdminTests from '../adminPages/AdminTests';

export type ModalControl = {
  setTask: CallableFunction,
  setModal: CallableFunction
}

export default function AdminPage() {
  const {user} = useAppSelector(state => state.UserReducer);
  const navigate = useNavigate();

  const [quests, setQuests] = useState<IQuest[]>([]);
  const [routes, setRoutes] = useState<IAdminRouteData[]>([]);
  const [update, setUpdate] = useState(true);
  const [task, setTask] = useState<JSX.Element>()
  const [modal, setModal] = useState(false);
  
  const getQuests = async () => {
    const quests = await getAllQuests();
    setQuests(quests);
  }

  const getRoutes = async () => {
    const routes = await getAllRoutes();
    setRoutes(routes);
  }

  const toggleModal = () => {
    setModal(prev => !prev);
  }

  useEffect(() => {
    if (user.role !== 'ADMIN') {
      navigate('/');
    }
  })

  useEffect(() => {
    if (update) {
      getQuests();
      getRoutes();
      setUpdate(false);
    }
  }, [update]);

  return (
    <div className='admin'>
      <nav className="nav nav--admin">
        <div className="nav__inner">
          <Link to={'/admin/'} className="nav__btn">Квесты</Link>
          <Link to={'/admin/puzzles'} className="nav__btn">Пазлы</Link>
          <Link to={'/admin/tests'} className="nav__btn">Тесты</Link>
          <Link to={'/admin/routes'} className="nav__btn">Маршруты</Link>
          <Link to={'/admin/new'} className="nav__btn">Админы</Link>
        </div>
      </nav>
      <Routes>
        <Route path='/' element={<AdminQuests quests={quests} routes={routes} callback={setUpdate}></AdminQuests>} />
        <Route path='/puzzles' element={<AdminPuzzles quests={quests} routes={routes} modal={{setModal, setTask}}></AdminPuzzles>} />
        <Route path='/tests' element={<AdminTests quests={quests} routes={routes} modal={{setModal, setTask}}></AdminTests>} />
        <Route path='/routes' element={<AdminRoutes quests={quests} routes={routes} callback={setUpdate}></AdminRoutes>} />
        <Route path='/new' element={<AdminNew></AdminNew>} />
      </Routes>
      <div className={modal  ? 'modal show' : 'modal'}>
        <div className="modal__bg" onClick={toggleModal}></div>
        <div className="modal__content">
          <ModalHeader title='Настройки' callback={toggleModal}></ModalHeader>
          <div className="modal__body">
            {
              modal && task &&
              task
            }
          </div>
        </div>
      </div>
    </div>
  )
}
