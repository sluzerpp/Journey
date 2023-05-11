import React, { useEffect, useRef, useState } from 'react'
import { createPuzzle, deletePuzzle, getAllPuzzles, updatePuzzle } from '../../api/puzzles';
import { IAdminRouteData } from '../../api/routes';
import PuzzleElem from '../../components/taskPage/PuzzleElem';
import ButtonUI from '../../components/UI/ButtonUI';
import { useFileValidate } from '../../hooks/useValidate';
import { showError } from '../../store/reducers/Actions/Actions';
import { Difficult, IPuzzle, IQuest } from '../../types/IQuest';
import { isImageFile } from '../../util/validation';
import { ModalControl } from '../mainPages/AdminPage';
import { AdminRouteListItem, urlToObject } from './AdminQuests';

const StringToDifficult = (str: string) => {
  switch (str) {
    case Difficult.EASY: {
      return Difficult.EASY;
    }
    case Difficult.HARD: {
      return Difficult.HARD;
    }
    case Difficult.MEDIUM: {
      return Difficult.MEDIUM;
    }
    default: {
      return Difficult.MEDIUM;
    }
  }
}

export default function AdminPuzzles({quests, routes, modal}: {quests: IQuest[], routes: IAdminRouteData[], modal: ModalControl}) {
  const [puzzle, setPuzzle] = useState<IPuzzle>();
  const [currentQuest, setCurrentQuest] = useState<IQuest>();
  const [update, setUpdate] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [questId, setQuestId] = useState<string>('');
  const [difficult, setDifficult] = useState<Difficult>(Difficult.MEDIUM);
  
  const imgRef = useRef<HTMLInputElement>(null);

  const {file: img, preview, onChange: onImgChange, isValid: isImgValid, setImage} = useFileValidate(imgRef, isImageFile);

  const questHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuestId(e.target.value);
  }

  const selectHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDifficult(StringToDifficult(e.target.value))
  }

  const getPuzzle = async (questId: number) => {
    const response = await getAllPuzzles(questId);
    if (response.length > 0) {
      setPuzzle(response[0]);
      const img = await urlToObject(response[0].image);
      setImage(img);
      setDifficult(StringToDifficult(response[0].difficult))
    } else {
      setPuzzle(undefined);
      setImage();
      setDifficult(Difficult.MEDIUM);
    }
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

  const createBtnHandler = async () => {
    if (!currentQuest) return;
    try {
      await createPuzzle({
        questId: currentQuest.id,
        difficult: difficult,
      });
      await getPuzzle(currentQuest.id);
      success();
    } catch (e) {
      error();
    }
    setUpdate(true);
  }

  const updateBtnHandler = async () => {
    if (!currentQuest || !puzzle) return;
    try {
      await updatePuzzle(puzzle.id, {
        difficult: difficult,
        image: img,
      });
      await getPuzzle(currentQuest.id);
      success();
    } catch (e) {
      error();
    }
    setUpdate(true);
  }

  const deleteBtnHandler = async () => {
    if (!currentQuest || !puzzle) return;
    try {
      await deletePuzzle(puzzle.id);
      await getPuzzle(currentQuest.id);
      success();
    } catch (e) {
      error();
    }
    setUpdate(true);
  }

  const testBtnHandler = () => {
    if (puzzle) {
      modal.setModal(true);
      modal.setTask(<PuzzleElem puzzle={puzzle} closeModal={() => modal.setModal(false)}></PuzzleElem>)
    }
  }

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
    if (currentQuest) {
      getPuzzle(currentQuest.id);
    }
  }, [currentQuest]);

  useEffect(() => {
    setUpdate(false);
  }, [update]);

  return (
    <div className="admin__page">
      <div className={`success ${isSuccess ? 'show' : ''}` } onClick={() => setSuccess(false)}>Успешно изменено!</div>
      <div className="admin__title">Выбрать существующий</div>
      <select value={questId} onChange={questHandler} className='input input--two-columns'>
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
      <h2 className='input--two-columns'>Пазл</h2>
      {
        currentQuest ?
        <>
          {
            puzzle ?
            <>
              <input ref={imgRef} className='input input--two-columns' type='file' onChange={onImgChange}></input>
              { img && preview && (img.type.includes('image')) && <div className='admin__preview' style={{backgroundImage: `url(${preview})`}}></div> }
              {/* <div className="admin__title">Сложность</div>
              <select value={difficult} onChange={selectHandler} className='input input--two-columns'>
                <option value={Difficult.EASY}>Легкая</option>
                <option value={Difficult.MEDIUM}>Средняя</option>
                <option value={Difficult.HARD}>Сложная</option>
              </select> */}
              <ButtonUI callback={updateBtnHandler}>Обновить</ButtonUI>
              <ButtonUI className='danger' callback={deleteBtnHandler}>Удалить</ButtonUI>
              <ButtonUI callback={testBtnHandler} className='input--two-columns'>Тестировать</ButtonUI>
            </>
            : 
            <>
              <h2 className='input--two-columns'>Пазл отсутствует</h2>
              <ButtonUI callback={createBtnHandler} className='input--two-columns'>Создать пазл</ButtonUI>
            </>
          }
        </> :
        <>
          <h2 className='input--two-columns'>Выберите квест</h2>
        </>
      }
    </div>
  )
}
