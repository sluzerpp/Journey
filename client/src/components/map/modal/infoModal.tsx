import React from 'react'

export default function InfoModal() {

  return (
    <div className='info'>
      <p>Добро пожаловать в квест-игру "Достопримечательности Пинска"!</p>

      <p>Для того чтобы начать квест необходимо найти его на карте, в меню "Квесты рядом" или в меню "Квесты", после чего нажать кнопку "Начать".</p>

      <p>
        Чтобы выполнить квест необходимо:
      </p>

      <ol>
        <li>Добраться до квеста;</li>
        <li>Подобравшись на достаточно близкое расстояние, кнопка у соответствующего квеста станет золотой с надписью "Выполнить";</li>
        <li>Нажимаем на кнопку, после чего если у квеста есть тест или пазл выполняем его;</li>
        <li>Вы потрясающий!</li>
      </ol>

      <p>Для построения маршрута необходимо найти интересующий квест на карте, после чего нажать на него и в открывшемся всплывающем окне нажать кнопку "<i className="uil uil-analysis"></i>".</p>

      <p>Для фильтрации квестов и/или маршрутов необходимо нажать на кнопку "<i className="uil uil-filter"></i>", после чего нажать на пункты которые необходимо скрыть или показать.</p>
    </div>
  )
}
