import React from 'react'
import { IFact } from '../../types/IQuest'

type IProps = {
  description: string,
  facts: IFact[]
}

export default function SingleDescription({description, facts}: IProps) {
  return (
    <>
      <div className="single__description">
        {description}
      </div>
      {
        facts.length > 0 &&
        <div className="single__facts">
          <div className="single__title-small">
            Интересные факты
          </div>
          {
            facts.map(({id, fact}) => {
              return (
                <div key={id} className="single__fact">
                  {fact}
                </div>
              )
            })
          }
        </div>
      }
    </>
  )
}
 