import React, { MouseEvent, useContext, useEffect, useReducer, useState } from 'react'
import { ThemeContext } from 'styled-components'
import { Board } from '../Board/Board'
import { Cell } from '../Cell/Cell'
import { Score } from '../Score/Score'
import { checkBoardIsFull, checkWinner, Player } from './logic'
import { init, reducer } from './reducer'
import * as S from './styles'

export const Grid = () => {
  const themeContext = useContext(ThemeContext)
  const initialState = init(themeContext.gridSize)

  const [gameState, dispatch] = useReducer(reducer, initialState)

  const [state, setState] = useState([
    ...Array(themeContext.gridSize * themeContext.gridSize).fill({
      isLeft: false,
      isRight: false,
      isUp: false,
      isDown: false,
    }),
  ])

  console.log(state)

  useEffect(() => {
    if (gameState.winner || gameState.draw) {
      return
    }

    const winner = checkWinner(gameState.cellStates, themeContext.gridSize)
    if (winner) {
      dispatch({ type: 'SET_WINNER', winner })
      return
    }

    const draw = checkBoardIsFull(gameState.cellStates)
    if (draw) {
      dispatch({ type: 'SET_DRAW' })
    }

    if (gameState.moveBy === 'human') {
      // setTimeout(() => dispatch({ type: 'SET_CELL', index, moveBy: 'computer' }), 600)
    }
  }, [gameState, themeContext.gridSize])

  const reset = (gridSize: number) => {
    dispatch({ type: 'RESET', gridSize })
  }

  const shouldShowScore = Boolean(gameState.winner || gameState.draw)
  return (
    <S.Container opacity={shouldShowScore ? 0.2 : 1}>
      <Board />
      <S.Wrapper>
        {gameState.cellStates.map((cellState, i) => {
          const setCell = (index: number, e: any) => {
            // e.preserveEvent()
            const x = e.nativeEvent.offsetX
            const y = e.nativeEvent.offsetY

            const padding = themeContext.cellWidth / 7
            const isLeft = x < padding
            const isRight = x + padding > themeContext.cellWidth
            const isUp = y < padding
            const isDown = y + padding > themeContext.cellWidth

            setState((state) => {
              return {
                ...state,
                ...(isLeft && index % themeContext.gridSize !== 0
                  ? {
                      [index - 1]: {
                        ...state[index - 1],
                        isRight: true,
                      },
                    }
                  : {}),
                ...(isRight && index < themeContext.gridSize * themeContext.gridSize
                  ? {
                      [index - 1]: {
                        ...state[index - 1],
                        isRight: true,
                      },
                    }
                  : {}),
                [index]: {
                  ...state[index],
                  ...(isLeft ? { isLeft } : {}),
                  ...(isRight ? { isRight } : {}),
                  ...(isUp ? { isUp } : {}),
                  ...(isDown ? { isDown } : {}),
                },
              }
            })

            dispatch({ type: 'SET_CELL', index, moveBy: gameState.moveBy === 'computer' ? 'human' : 'computer' })
          }

          const borderStyle = '5px solid green'

          return (
            <Cell
              styles={{
                borderTop: state[i].isUp ? borderStyle : '',
                borderBottom: state[i].isDown ? borderStyle : '',
                borderLeft: state[i].isLeft ? borderStyle : '',
                borderRight: state[i].isRight ? borderStyle : '',
              }}
              idx={i}
              key={i}
              cellState={cellState}
              setCell={(e: any) => setCell(i, e)}
              disabled={cellState !== '_' || Boolean(gameState.winner)}
            />
          )
        })}
      </S.Wrapper>

      <Score
        winner={gameState.winner as Player}
        draw={gameState.draw}
        reset={reset}
        shouldShowScore={shouldShowScore}
      />
    </S.Container>
  )
}
