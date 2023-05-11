import React, { useEffect, useState } from 'react'
import { useMap } from 'react-leaflet';
import { useLocation, useNavigate } from 'react-router-dom';
import Spinner from '../../components/spinner/spinner';
import PuzzleElem from '../../components/taskPage/PuzzleElem';
import TestElem from '../../components/taskPage/TestElem';
import ButtonUI from '../../components/UI/ButtonUI';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setCenter } from '../../store/reducers/Actions/MapActionCreators';
import { updateQuestStatus } from '../../store/reducers/Actions/QuestRouteActionCreators';
import { Status } from '../../types/IMap';
import { IPuzzle, IQuestPart, ITest, IUserQuest } from '../../types/IQuest';

interface TaskPageProps {
  quest: IQuestPart,
  tests: ITest[],
  puzzles: IPuzzle[],
  questRouteId?: number
}

export default function TaskPage({quest, tests, puzzles}: TaskPageProps) {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [completedTaskCount, setCompletedTaskCount] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  const taskCount = tests.length + puzzles.length;
  const tasks: JSX.Element[] = [
    ...tests.map((test) => <TestElem test={test} setCompletedTaskCount={setCompletedTaskCount}></TestElem>),
    ...puzzles.map((puzzle) => <PuzzleElem puzzle={puzzle} setCompletedTaskCount={setCompletedTaskCount}></PuzzleElem>)
  ]; 
  
  const [currentTask, setCurrentTask] = useState(0);

  function isAllComplete() {
    if (taskCount == completedTaskCount) {
      return true;
    }
    return false;
  }

  function start() {
    setIsStarted(true);
    setCompletedTaskCount(0);
    setIsFinished(false);
    setCurrentTask(0);
  }

  function completeQuest() {
    if (!isAllComplete()) return;
    setIsFinished(true);
    setTimeout(() => {  
      dispatch(updateQuestStatus(quest.id, Status.Completed));
    }, 1500)
  }

  useEffect(() => {
    setCurrentTask(prev => prev + 1);
    setIsFinished(isAllComplete());
    completeQuest();
  }, [completedTaskCount])

  function onBackBtn() {
    if (!isStarted && !isFinished) {
      dispatch(setCenter([quest.latitude, quest.longitude]));
      navigate('/');
    }
    if (isStarted || isFinished) {
      setIsStarted(false);
      setIsFinished(false);
    }
  }

  useEffect(() => {
    completeQuest();
    setLoading(false);
  }, []);

  return (
    <div className='task'>
      <button className='task__back' onClick={onBackBtn}><i className="uil uil-arrow-left"></i></button>
      {
        loading &&
        <Spinner></Spinner>
      }
      {
        isFinished && !loading &&
        <div className="task__complete">
          <h2>Вы лучшие!</h2>
          <h3>Квест пройден!</h3>
          <h3>Открываем подробности...</h3>
        </div>
      }
      {
        !isStarted && !isFinished &&
        <div className="task__start">
          <div className="task__title">
            {quest.name}
          </div>
          <div className="task__experience">
          <i className="uil uil-star"></i>{quest.experience}
          </div>
          <ButtonUI callback={start}>Начать<br />Выполнение</ButtonUI>
        </div>
      }
      {
        isStarted &&
        tasks[currentTask]
      }
    </div>
  )
}
