import React, { useEffect, useRef, useState } from 'react'
import { getAllPuzzles } from '../../api/puzzles';
import { IAdminRouteData } from '../../api/routes';
import { createTest, createTestQuestion, deleteTest, deleteTestQuestion, getAllTests, TestQuestionData, updateTest, updateTestQuestion } from '../../api/tests';
import TestElem from '../../components/taskPage/TestElem';
import ButtonUI from '../../components/UI/ButtonUI';
import { useValidate } from '../../hooks/useValidate';
import { showError } from '../../store/reducers/Actions/Actions';
import { IQuest, ITest, ITestQuestion } from '../../types/IQuest';
import { isNotEmpty } from '../../util/validation';
import { ModalControl } from '../mainPages/AdminPage';
import { AdminRouteListItem } from './AdminQuests';

function QuestionElem(
  {question, update, del} :
  {
    question: ITestQuestion,
    update: CallableFunction,
    del: CallableFunction
  }) {
  const textRef = useRef(null);
  const answerRef = useRef(null);

  const {input: textInput, isValid: isTextValid} = useValidate(textRef, isNotEmpty, question.question);
  const {input: answerInput, isValid: isAnswerValid} = useValidate(answerRef, isNotEmpty, question.answer);

  const updateBtnHandler = () => {
    if (!isTextValid() || !isAnswerValid()) return;
    update(question.id, textInput.value, answerInput.value);
  }

  return (
    <div className="admin__question">
      <div className="col">
        <h4>Вопрос</h4>
        <input ref={textRef} {...textInput} className='input' placeholder='Вопрос'></input>
      </div>
      <div className="col">
        <h4>Ответ</h4>
        <input ref={answerRef} {...answerInput} className='input' placeholder='Ответ'></input>
      </div>
      <ButtonUI callback={updateBtnHandler}>Обновить вопрос</ButtonUI>
      <ButtonUI callback={del} className='danger'>Удалить вопрос</ButtonUI>
    </div>
  )
}

export default function AdminTests({quests, routes, modal}: {quests: IQuest[], routes: IAdminRouteData[], modal: ModalControl}) {
  const [test, setTest] = useState<ITest>();
  const [currentQuest, setCurrentQuest] = useState<IQuest>();
  const [update, setUpdate] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [questId, setQuestId] = useState<string>('');

  const nameRef = useRef(null);

  const {input: nameInput, isValid: isNameValid, setValue: setName} = useValidate(nameRef, isNotEmpty, '');
  
  const questHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuestId(e.target.value);
  }

  const getTest = async (questId: number) => {
    setTest(undefined);
    setName('');
    const response = await getAllTests(questId);
    console.log(response);
    if (response.length > 0) {
      const test = response[0];
      setTest(test);
      setName(test.name);
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
      await createTest({
        questId: currentQuest.id,
        name: 'Новый тест',
        testQuestions: []
      });
      await getTest(currentQuest.id);
      success();
    } catch (e) {
      error();
    }
    setUpdate(true);
  }

  const updateBtnHandler = async () => {
    if (!currentQuest || !test || !isNameValid()) return;
    try {
      await updateTest(test.id, {
        name: nameInput.value,
      });
      await getTest(currentQuest.id);
      success();
    } catch (e) {
      error();
    }
    setUpdate(true);
  }

  const deleteBtnHandler = async () => {
    if (!currentQuest || !test) return;
    try {
      await deleteTest(test.id);
      await getTest(currentQuest.id);
      success();
    } catch (e) {
      error();
    }
    setUpdate(true);
  }

  const testBtnHandler = () => {
    if (test) {
      modal.setModal(true);
      modal.setTask(undefined);
      modal.setTask(<TestElem test={test} closeModal={() => modal.setModal(false)}></TestElem>)
    }
  }

  const addQuestionBtnHandler = async () => {
    if (test && currentQuest) {
      await createTestQuestion({
        testId: test.id,
        question: 'Новый вопрос',
        answer: 'Ответ'
      });
      await getTest(currentQuest.id);
    }
    setUpdate(true);
  }

  const updateQuestion = async (id: number, question: string, answer: string) => {
    if (test && currentQuest) {
      await updateTestQuestion(id, {
        question,
        answer
      })
      await getTest(currentQuest.id);
    }
    setUpdate(true);
  }

  const deleteQuestion = async (id: number) => {
    if (test && currentQuest) {
      await deleteTestQuestion(id)
      await getTest(currentQuest.id);
    }
    setUpdate(true);
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
      getTest(currentQuest.id);
    }
    setUpdate(true);
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
      <h2 className='input--two-columns'>Тест</h2>
      {
        currentQuest ?
        <>
          {
            test ?
            <>
              <div className="admin__title">Название</div>
              <input ref={nameRef} {...nameInput} className='input input--two-columns' placeholder='Название'></input>
              <ButtonUI callback={updateBtnHandler} className='input--two-columns'>Обновить Название</ButtonUI>
              <div className="admin__title">Вопросы</div>
              <ButtonUI callback={addQuestionBtnHandler} className='input--two-columns'>Добавить вопрос</ButtonUI>
              {
                test.testQuestions.length > 0 ?
                test.testQuestions.map((question) => {
                  return <QuestionElem key={question.id} question={question} update={updateQuestion} del={deleteQuestion}></QuestionElem>
                })
                : <h3 className='input--two-columns'>Вопросы отсутствует</h3> 
              }
              <ButtonUI callback={deleteBtnHandler} className='danger input--two-columns'>Удалить</ButtonUI>
              <ButtonUI callback={testBtnHandler} className='input--two-columns'>Тестировать</ButtonUI>
            </>
            : 
            <>
              <h2 className='input--two-columns'>Тест отсутствует</h2>
              <ButtonUI callback={createBtnHandler} className='input--two-columns'>Создать тест</ButtonUI>
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
