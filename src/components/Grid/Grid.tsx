import React, { useContext, useEffect, useReducer, useState } from 'react'
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
            const x = e.nativeEvent.offsetX
            const y = e.nativeEvent.offsetY

            const padding = themeContext.cellWidth / 7
            let isLeft = x < padding
            let isRight = x + padding > themeContext.cellWidth
            let isUp = y < padding
            let isDown = y + padding > themeContext.cellWidth

            const isLeftUp = isLeft && isUp
            const isLeftDown = isLeft && isDown
            const isRightUp = isRight && isUp
            const isRightDown = isRight && isDown

            console.log(isLeftUp, isLeftDown, isRightUp, isRightDown)

            // differentiate by trapezoid
            if (isLeftUp) {
              if (x < y) {
                // ◣
                isUp = false
              } else {
                // ◥
                isLeft = false
              }
            }
            if (isLeftDown) {
              const localY = y - (themeContext.cellWidth - padding)
              if (localY + x < padding) {
                // ◤
                isDown = false
              } else {
                // ◢
                isLeft = false
              }
            }
            if (isRightUp) {
              const localX = x - (themeContext.cellWidth - padding)
              if (localX + y < padding) {
                // ◤
                isRight = false
              } else {
                // ◢
                isUp = false
              }
            }
            if (isRightDown) {
              const localX = x - (themeContext.cellWidth - padding)
              const localY = y - (themeContext.cellWidth - padding)
              if (localX < localY) {
                // ◣
                isRight = false
              } else {
                // ◥
                isDown = false
              }
            }

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
                ...(isRight && (index + 1) % themeContext.gridSize !== 0
                  ? {
                      [index + 1]: {
                        ...state[index + 1],
                        isLeft: true,
                      },
                    }
                  : {}),
                ...(isUp && index > themeContext.gridSize
                  ? {
                      [index - themeContext.gridSize]: {
                        ...state[index - themeContext.gridSize],
                        isDown: true,
                      },
                    }
                  : {}),
                ...(isDown && index + themeContext.gridSize < themeContext.gridSize ** 2
                  ? {
                      [index + themeContext.gridSize]: {
                        ...state[index + themeContext.gridSize],
                        isUp: true,
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

          // use rough notation highlight instead of borders!
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
