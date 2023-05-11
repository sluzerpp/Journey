import React, { useEffect, useRef, useState } from 'react'
import { getAllQuests } from '../../api/quests';
import { createRoute, deleteRoute, IAdminRouteData, RouteQuestsData, updateRoute } from '../../api/routes'
import ButtonUI from '../../components/UI/ButtonUI';
import { useValidate } from '../../hooks/useValidate';
import { showError } from '../../store/reducers/Actions/Actions';
import { IQuest } from '../../types/IQuest'
import { isNotEmpty } from '../../util/validation';
import { AdminRouteListItem } from './AdminQuests';

export const isValidNumber = (str: string) => {
  const num = Number(str);
  if (isNaN(num) || num < 1) {
    return false;
  }
  return true;
}

function RouteQuestElem({quest, update, del, order}: {quest: IQuest, update: CallableFunction, del: CallableFunction, order: number}) {
  const orderRef = useRef(null);

  const {isValid, input} = useValidate(orderRef, isValidNumber, order);

  const updateBtnHandler = () => {
    if (!isValid()) return;
    update(Number(input.value));
  }

  return (
    <div className="admin__quest">
      {`${quest.id} - ${quest.name} | ${quest.experience}`}
      <input ref={orderRef} {...input} className='input' placeholder='Порядковый номер'></input>
      <ButtonUI callback={updateBtnHandler}>Обновить</ButtonUI>
      <ButtonUI callback={del}>X</ButtonUI>
    </div>
  )
}

export default function AdminRoutes({quests, routes, callback}: {quests: IQuest[], routes: IAdminRouteData[], callback: CallableFunction}) {
  const [update, setUpdate] = useState(false);
  const [isSuccess, setSuccess] = useState(false);

  const [routeQuests, setRouteQuests] = useState<IQuest[]>([]);

  const [currentQuest, setCurrentQuest] = useState<IQuest>();
  const [questId, setQuestId] = useState<string>('');
  
  const [currentRoute, setCurrentRoute] = useState<IAdminRouteData>();
  const [routeId, setRouteId] = useState<string>('');

  const nameRef = useRef(null);
  const expRef = useRef(null);

  const {isValid: isNameValid, input: nameInput, setValue: setName} = useValidate(nameRef, isNotEmpty, '');
  const {isValid: isExpValid, input: expInput, setValue: setExp} = useValidate(expRef, isValidNumber, 0);

  const routeSelectHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRouteId(e.target.value);
  }

  const questSelectHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuestId(e.target.value);
  }

  const success = () => {
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 2500)
  }

  const error = () => {
    showError('Ошибка');
  }

  const createEmptyRoute = async () => {
    try {
      await createRoute({
        name: 'Empty Route',
        experience: 1,
        quests: []
      });
      callback(true);
      success();
    } catch (e) {
      error()
    }
    setUpdate(true);
  }

  const updateDecor = async (route: IAdminRouteData) => {
    if (route.id) {
      await updateRouteAlt(route.id, route);
      callback(true);
      setUpdate(true);
    }
  }

  const updateRouteAlt = async (id: number, route: IAdminRouteData) => {
    try {
      await updateRoute(id, route);
      success();
    } catch (e) {
      error();
    }
  }
  
  const updateNameExpBtnHandler = async () => {
    if (!currentRoute || !isExpValid() || !isNameValid()) return;
    setCurrentRoute(prev => {
      if (prev) {
        prev.name = nameInput.value;
        prev.experience = expInput.value;
        updateDecor(prev);
      }
      return prev;
    });
  }

  const deleteRouteBtnHandler = async () => {
    if (!currentRoute || !currentRoute.id) return;
    try {
      await deleteRoute(currentRoute.id);
      setRouteQuests([]);
      success();
    } catch (e) {
      error();
    }
    setUpdate(true);
    callback(true);
  }

  const deleteQuestBtnHandler = (id: number) => {
    return async () => {
      if (currentRoute && currentRoute.quests) {
        try {
          setCurrentRoute(prev => {
            if (prev && prev.quests && prev.id) {
              prev.quests = prev.quests.filter((quest) => quest.id !== id);
              updateDecor(prev);
            } 
            return prev;
          });
          
          success();
        } catch (e) {
          error()
        }
        setUpdate(true);
      } 
    }
  }

  const updateBtnHandler = (id: number) => {
    return (order: number) => {
      if (!currentRoute) return;
      setCurrentRoute(prev => {
        if (prev && prev.id) {
          if (prev.quests) {
            const quest = prev.quests.find((quest) => quest.id === id);
            if (quest) {
              quest['questRoute-quest'].order = order;
              prev.quests = [...prev.quests.filter((quest) => quest.id !== id), quest];
            }
          }
          updateRouteAlt(prev.id, prev);
        }
        return prev;
      });
    }
  } 

  const addQuestBtnHandler = async () => {

    if (!currentQuest || !currentRoute) return; 
    try {
      setCurrentRoute((prev) => {
        if (prev) {
          if (prev.quests && prev.quests.length > 0) {
            prev.quests = [...prev.quests, {id: currentQuest.id, "questRoute-quest": {order: prev.quests.length + 1}}]
          } else {
            prev.quests = [{id: currentQuest.id, "questRoute-quest": {order: 1}}];
          }
          console.log(prev.quests);
          updateDecor(prev);
        }
        return prev;
      });
      success();
    } catch (e) {
      error();
    }
    
  }

  useEffect(() => {
    if (routeId !== '') {
      const id = Number(routeId);
      const route = routes.find((route) => route.id === id);
      console.log(route);
      if (route) {
        setCurrentRoute(route);
      }
    }
  }, [routeId, routes])

  useEffect(() => {
    if (currentRoute) {
      const routeQuests = quests.filter((quest) => {
        if (!currentRoute.quests) return false;
        return currentRoute.quests.map(el => el.id).includes(quest.id);
      });
      setRouteQuests(routeQuests);
      if (currentRoute.name) {
        setName(currentRoute.name);
      }
      if (currentRoute.experience) {
        setExp(currentRoute.experience);
      }
    }
  }, [currentRoute]);

  useEffect(() => {
    if (questId !== '') {
      const id = Number(questId);
      const quest = quests.find((quest) => quest.id === id);
      if (quest) {
        setCurrentQuest(quest);
      }
    }
  }, [questId, quests])

  useEffect(() => {
    setUpdate(false);
    callback(true);
  }, [update]);

  return (
    <div className="admin__page">
      <div className={`success ${isSuccess ? 'show' : ''}` } onClick={() => setSuccess(false)}>Успешно изменено!</div>
      <div className="admin__title">Выбрать маршрут</div>
      <select value={routeId} onChange={routeSelectHandler} className='input input--two-columns'>
        <option key={`empty option`} value={''} disabled></option>
        {
          routes.length > 0 &&
          routes.map((route) => {
            return <option key={route.id} value={route.id}>
              {`Маршрут - ${route.id}: ${route.name} | ${route.experience}`}
              </option>
          })
        }
      </select>
      <ButtonUI callback={createEmptyRoute} className='input--two-columns'>Создать пустой маршрут</ButtonUI>
      <ButtonUI callback={deleteRouteBtnHandler} className='input--two-columns danger'>Удалить выбранный маршрут</ButtonUI>
      <div className="admin__title">Название и опыт</div>
      {
        currentRoute ?
        <>
          <input ref={nameRef} {...nameInput} className='input' placeholder='Название'></input>
          <input ref={expRef} {...expInput} className='input' placeholder='Опыт'></input>
          <ButtonUI callback={updateNameExpBtnHandler} className='input--two-columns'>Обновить</ButtonUI>
        </>
        : <h3 className='input--two-columns'>Выберите маршрут</h3>
      }
      <div className="admin__title">Выбрать квест</div>
      <select value={questId} onChange={questSelectHandler} className='input input--two-columns'>
        <option key={`empty option`} value={''} disabled></option>
        {
          quests.length > 0 &&
          quests.map((quest) => {
            if (quest.isRouteQuest) return null;
            return <option key={`${quest.id} ${quest.name} ${quest.description}`} value={quest.id}>
              {`Одиночный - ${quest.id}: ${quest.name} | ${quest.type} | ${quest.experience}`}
              </option>
          })
        }
        {
          routes.map((route, id) => {
            if (!route.quests || route.quests.length === 0) return null;
            const routeQuests = quests.filter((quest) => {
              if (!route.quests) return false;
              return route.quests.map(el => el.id).includes(quest.id);
            });
            return (
              <AdminRouteListItem key={`${route.id} ${id}`} routeQuests={routeQuests} route={route}></AdminRouteListItem>
            )
          }).filter(el => el !== null)
        }
      </select>
      <ButtonUI callback={addQuestBtnHandler} className='input--two-columns'>Добавить выбранный квест к маршруту</ButtonUI>
      <div className="admin__title">Квесты выбранного маршрута</div>
      {
        (routeQuests.length > 0 && currentRoute) ?
          routeQuests.map((quest) => {
            const data = currentRoute.quests?.find((q) => q.id === quest.id);
            if (data) {
              return <RouteQuestElem key={quest.id} order={data['questRoute-quest'].order} quest={quest} update={updateBtnHandler(quest.id)} del={deleteQuestBtnHandler(quest.id)}></RouteQuestElem>
            }
          })
        : <h3 className='input--two-columns'>Квесты отсутствуют</h3>
      }
    </div>
  )
}
