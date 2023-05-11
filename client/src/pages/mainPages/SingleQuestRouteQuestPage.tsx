import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import SingleHeader from '../../components/singlePage/Header';
import Images from '../../components/singlePage/images';
import SingleDescription from '../../components/singlePage/SingleDescription';
import Spinner from '../../components/spinner/spinner';
import PuzzleElem from '../../components/taskPage/PuzzleElem';
import TestElem from '../../components/taskPage/TestElem';
import ButtonUI from '../../components/UI/ButtonUI';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import useNear from '../../hooks/useNear';
import useRouteQuests from '../../hooks/useRouteQuests';
import { setCenter, setIsModal } from '../../store/reducers/Actions/MapActionCreators';
import { Status } from '../../types/IMap';
import { IQuestRoutePart, IQuestRouteQuest } from '../../types/IQuestRoute';
import TaskPage from './TaskPage';

const HOST = process.env.REACT_APP_API_URL;

export default function SingleQuestRouteQuestPage() {
  const params = useParams();
  const id: number = params.id ? Number(params.id) : -1;
  const questId: number = params.questId ? Number(params.questId) : -1;

  const {questResponses, isLoading} = useAppSelector(state =>  state.QuestRoute_QuestsReducer);

  const questRes = questResponses.find((el) => el.questRouteId === id);
  
  const questResponse = questRes?.questRes;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isTest, setIsTest] = useState(false);
  const [isPuzzle, setIsPuzzle] = useState(false);
  const [currentTask, setCurrentTask] = useState(-1);

  let quest: IQuestRoutePart | undefined;
  let others: IQuestRouteQuest[] = [];
  let questData: IQuestRouteQuest | undefined;

  if (questResponse) {
    questData = questResponse.quests.find((quest) => quest.quest.id === questId);
    quest = questData?.quest;
    others = questResponse.quests.filter((quest) => quest.quest.id !== questId);
  }

  let puzzles: JSX.Element[] = [];
  let tests: JSX.Element[] = [];

  function findQuest() {
    if (!quest) return;
    dispatch(setCenter([quest.latitude, quest.longitude]));
    dispatch(setIsModal(false));
    navigate('/');
  }

  function closeTask() {
    setIsPuzzle(false);
    setIsTest(false);
  }

  if (quest && quest.tests && quest.puzzles) {
    tests = [...quest.tests.map((test) => <TestElem test={test} closeModal={closeTask}></TestElem>)];
    puzzles = [...quest.puzzles.map((puzzle) => <PuzzleElem puzzle={puzzle} closeModal={closeTask}></PuzzleElem>)];
  } 

  function openTest(id: number) {
    setCurrentTask(id);
    setIsTest(true);
    setIsPuzzle(false);
  }

  function openPuzzle(id: number) {
    setCurrentTask(id);
    setIsTest(false);
    setIsPuzzle(true);
  }

  useRouteQuests(id);

  const {distance} = useNear([quest?.latitude || 0, quest?.longitude || 0])

  if (isLoading) {
    return <Spinner></Spinner>
  }

  if (questData?.['user-quest'].state === Status.Accepted && quest) {
    return <TaskPage quest={quest} tests={quest.tests} puzzles={quest.puzzles}></TaskPage>
  }

  if (questData?.['user-quest'].state === Status.Completed) {
    return (
      quest
      ? 
      <div className='single'>
        <div className="single__content">
          <SingleHeader type='Маршрутный квест' title={quest.name} distance={distance || 0}></SingleHeader>
          <Images thumbnail={quest.thumbnail} images={quest.images}></Images>
          <SingleDescription description={quest.description} facts={quest.facts}></SingleDescription>
          {
            (quest.tests.length > 0 || quest.puzzles.length > 0) &&
            <div className="single__tasks">
            <div className="single__title-small">Тесты и паззлы</div>
            {
              quest.tests &&
              quest.tests.map((test, id) => {
                return (
                  <div key={test.id} className="single__task">
                    <div className="single__task-content">
                      <div className="single__task-name">{test.name}</div>
                    </div>
                    <ButtonUI callback={() => openTest(id)}>Начать</ButtonUI>
                  </div>
                ) 
              })
            }
            {
              quest.puzzles &&
              quest.puzzles.map((puzzle, id) => {
                return (
                  <div key={puzzle.id} className="single__task">
                    <div className="single__task-content">
                      <div className="single__task-img" style={{backgroundImage: `url(${HOST})`}}></div>
                      <div className="single__task-name">Пазл</div>
                    </div>
                    <ButtonUI callback={() => openPuzzle(id)}>Начать</ButtonUI>
                  </div>
                ) 
              })
            }
            </div>
          }
        </div>
        <div className="single__controls">
          <div className="single__controls-inner">
            <ButtonUI callback={findQuest}><i className="uil uil-location-point"></i></ButtonUI>
          </div>
        </div>
        {
          ((isTest && !isPuzzle) || (isPuzzle && !isTest)) &&
          <div className="single__task-current">
            <button className='task__back' onClick={closeTask}><i className="uil uil-arrow-left"></i></button>
            {
              isTest && 
              tests.find((el, id) => id === currentTask)
            }
            {
              isPuzzle && 
              puzzles.find((el, id) => id === currentTask)
            }
          </div>
        }
      </div>
      : <h2>Квест не найден!</h2>
    )
  }

  return (
    <>
    <h2>Информация недоступна!</h2>
    <h3>Пройдите или разблокируйте квест<br></br>прежде чем просматривать информацию о нём</h3>
    </>
  )
}
