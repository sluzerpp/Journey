import React from 'react'
import { Link } from 'react-router-dom'

export default function navigation() {
  return (
    <nav className="nav">
      <div className="nav__inner">
        <Link to={'/'} className="nav__btn"><i className="nav__icon uil uil-map"></i> Карта</Link>
        <Link to={'/routes'} className="nav__btn"><i className="nav__icon uil uil-share-alt"></i> Маршруты</Link>
        <Link to={'/myquests'} className="nav__btn"><i className="nav__icon uil uil-book-alt"></i> Мои задания</Link>
        <Link to={'/quests'} className="nav__btn"><i className="nav__icon uil uil-clipboard-notes"></i> Задания</Link>
        <Link to={'/profile'} className="nav__btn"><i className="nav__icon uil uil-user"></i> Профиль</Link>
      </div>
    </nav>
  )
}