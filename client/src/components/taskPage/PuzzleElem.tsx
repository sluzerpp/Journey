import React, { useEffect, useState } from 'react'
import { IPuzzle } from '../../types/IQuest'
import ButtonUI from '../UI/ButtonUI';

export interface IPuzzleProps {
  puzzle: IPuzzle,
  setCompletedTaskCount?: CallableFunction,
  closeModal?: CallableFunction
}

const HOST = process.env.REACT_APP_API_URL;

export type BlockState = {
  num: number,
  rotate: number
}

const DEFAULT_FIELD = [
  {num: 0, rotate: 0},
  {num: 1, rotate: 0},
  {num: 2, rotate: 0},
  {num: 3, rotate: 0},
  {num: 4, rotate: 0},
  {num: 5, rotate: 0},
  {num: 6, rotate: 0},
  {num: 7, rotate: 0},
  {num: 8, rotate: 0},
];

function getRandomDegree() {
  const degrees = [0, 90, 180, 270];
  return degrees[Math.trunc(Math.random() * 4)];
}

function shuffle(array: BlockState[]) {
  array.sort(() => Math.random() - 0.5);
}

function shuffleField(field: BlockState[]) {
  const copy = [...field];
  shuffle(copy);
  // return field.map((el) => {
  //   return {...el, rotate: getRandomDegree()};
  // })
  return copy;
}

export default function PuzzleElem(props: IPuzzleProps) {
  const {puzzle, setCompletedTaskCount} = props;
  const [isEnd, setIsEnd] = useState(false);
  const [isStart, setIsStart] = useState(false);
  const [currentField, setCurrentField] = useState<BlockState[]>(DEFAULT_FIELD);
  const [firstItem, setFirstItem] = useState<{num: number, pos: number}>();
  const [secondItem, setSecondItem] = useState<{num: number, pos: number}>();

  function start() {
    setFirstItem(undefined);
    setSecondItem(undefined);
    setCurrentField(shuffleField(DEFAULT_FIELD));
    setIsStart(true);
  }

  // function createBlockRotate(state: BlockState) {
  //   return (e: React.MouseEvent) => {
  //     console.log("here");
  //     setCurrentField(prev => {
  //       return prev.map((item) => {
  //         if (item.num === state.num) {
  //           if (item.rotate === 270) {
  //             item.rotate = 0;
  //           } else {
  //             item.rotate += 90;
  //           }
  //           return item;
  //         } else {
  //           return item;
  //         }
  //       });
  //     })
  //   }
  // }

  function createBlockClick(state: BlockState) {
    return (e: React.MouseEvent) => {
      if (!isEnd) {
        if (!firstItem) {
          setFirstItem({num: state.num, pos: currentField.indexOf(state)});
        } else if (!secondItem) {
          setSecondItem({num: state.num, pos: currentField.indexOf(state)});
        }
      }
    }
  }

  useEffect(() => {
    
  }, [currentField]);

  useEffect(() => {
    if (firstItem && secondItem) {
      setCurrentField(prev => {
        prev[firstItem.pos].num = secondItem.num;
        prev[secondItem.pos].num = firstItem.num;
        if (isStart) {
          if (prev.every((el, id) => el.num === id)) {
            setIsEnd(true)
          }
        }
        return prev;
      })
      setFirstItem(undefined);
      setSecondItem(undefined);
    }
  }, [firstItem, secondItem])

  function btnHandler() {
    if (isEnd) {
      if (props.closeModal) {
        props.closeModal();
        return;
      }
      if (setCompletedTaskCount) {
        setCompletedTaskCount((prev: number) => prev + 1);
      }
    }
  }

  useEffect(() => {
    start();
  }, [])

  return (
    <div className="task-item">
      <div className="task-item__title">
        Пазл
      </div>
      <div className="task-item__content">
        <div className="puzzle__field">
          {
            currentField.map((el) => {
              return <div onClick={createBlockClick(el)} key={el.num}
                className={`puzzle__block b${el.num+1}`}
                style={{
                  transform: `rotate(${el.rotate}deg)`,
                  backgroundImage: `url(${HOST}/${puzzle.image})`,
                }}
              >
              </div>
            })
          }
        </div>
      </div>
      <div className="task__button">
        <ButtonUI callback={btnHandler} className={isEnd ? '' : 'disabled'}>
          Завершить
        </ButtonUI>
      </div>
    </div>
  )
}
