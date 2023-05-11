import React, { useEffect, useState } from 'react'
import { ITest, ITestQuestion } from '../../types/IQuest'
import ButtonUI from '../UI/ButtonUI';
import PawSVG from '../svg/pawSvg';

export interface TestProps {
  setCompletedTaskCount?: CallableFunction;
  test: ITest;
  closeModal?: CallableFunction;
}

export function shuffle<T>(array: T[]) {
  array.sort(() => Math.random() - 0.5);
  return array;
}

export default function TestElem(props: TestProps) {
  const {test, setCompletedTaskCount, closeModal} = props;
  const {testQuestions} = test;
  console.log(test);
  const count = testQuestions.length;
  const [rightCount, setRightCount] = useState(0);
  const [isWrong, setIsWrong] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentRightAnswer, setCurrentRightAnswer] = useState(testQuestions[currentQuestion].answer);
  const [currentUserAnswer, setCurrentUserAnswer] = useState<string>();
  const [variation, setVariation] = useState<ITestQuestion[]>([]);
  const [answerStatus, setAnswerStatus] = useState<string>('');

  function getVariations(questionId: number) {
    let variation = [...testQuestions.filter((el, index) => index !== questionId)];
    variation = shuffle<ITestQuestion>(variation);
    variation = variation.slice(0, 3);
    const temp = testQuestions[questionId];
    variation.push(temp);
    variation = shuffle<ITestQuestion>(variation);
    return variation;
  }

  useEffect(() => {
    setVariation(getVariations(currentQuestion));
  }, [isWrong])

  useEffect(() => {
    setVariation(getVariations(currentQuestion));
  }, [])

  function changeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) {
      setCurrentUserAnswer(e.target.dataset.answer);
    }
  }

  function btnHandler() {
    if (currentUserAnswer && currentQuestion < count - 1) {
      if (currentUserAnswer === currentRightAnswer) {
        setRightCount(prev => prev + 1);
        setAnswerStatus('right');
      } else {
        setAnswerStatus('wrong')
      }
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
        setVariation(getVariations(currentQuestion + 1));
        setCurrentUserAnswer('');
        setCurrentRightAnswer(testQuestions[currentQuestion + 1].answer);
        setAnswerStatus('');
      }, 500)
    } else if (currentQuestion === count - 1) {
      if (currentUserAnswer === currentRightAnswer) {
        if (rightCount + 1 === count) {
          if (closeModal) {
            closeModal();
            return;
          }
          if (setCompletedTaskCount) {
            setCompletedTaskCount((prev: number) => prev + 1);
          }
          return;
        }
      } 
      setIsWrong(true);
      setTimeout(() => {
        setIsWrong(false);
        setCurrentQuestion(0);
        setCurrentUserAnswer('');
        setCurrentRightAnswer(testQuestions[0].answer);
        setRightCount(0);
      }, 2500);
    } 
  }

  if (isWrong) {
    return (
      <div className="task-item">
        <h2>Не все ответы верны!</h2>
        <h3>{rightCount}/{count}</h3>
        <h3>Попробуй ещё раз!</h3>
      </div>
    )
  }

  return (
    <div className="task-item">
      <div className="task-item__suptitle">Тест</div>
      <div className="task-item__title">
        {test.name}
      </div>
      <div className={`task-item__content ${answerStatus}`}>
        <div className="test__question">
          {testQuestions[currentQuestion].question}
        </div>
        <div className="test__variants">
          {variation.map((variant, id) => {
            return (
              <label key={id} className="test__label">
                <input type="radio" name='variants' checked={currentUserAnswer === variant.answer ? true : false} onChange={changeHandler} data-answer={variant.answer}/>
                <label><PawSVG className='test__paw'></PawSVG></label>
                {variant.answer}
              </label>
            )
          })}
        </div>
      </div>
      <div className="task__button">
        <ButtonUI callback={btnHandler} className={currentUserAnswer ? '' : 'disabled'}>{
          currentQuestion === count - 1 ?
          'Завершить' :
          'Следующий'
        }</ButtonUI>
      </div>
    </div>
  )
}
