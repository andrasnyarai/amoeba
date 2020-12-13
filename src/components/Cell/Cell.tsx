import React, { MouseEvent, useContext, useRef } from 'react'
import { RoughNotation } from 'react-rough-notation'
import { ThemeContext } from 'styled-components'
import { CellState } from '../Grid/logic'
import * as S from './styles'

function lerp(start: number, end: number, amt: number): number {
  return (1 - amt) * start + amt * end
}

const TypedRoughNotation = RoughNotation as any

type Props = {
  cellState: CellState
  setCell: any
  disabled: boolean
  idx: number
  styles: object
}

export const Cell = ({ cellState, setCell, disabled, idx, styles }: Props) => {
  const themeContext = useContext(ThemeContext)

  const type = cellState === 'x' ? 'crossed-off' : 'circle'
  const ix = lerp(Math.random(), 1, 3)
  const jx = lerp(Math.random(), 1, 9)
  const ref = useRef([ix, jx])
  const [iterations, w] = ref.current

  const x = idx % themeContext.gridSize
  const y = Math.floor(idx / themeContext.gridSize)

  return (
    <S.Wrapper style={styles} onClick={disabled ? () => {} : setCell} disabled={disabled}>
      <S.Marker>
        {cellState !== '_' && (
          <TypedRoughNotation
            animationDuration={400}
            iterations={iterations}
            strokeWidth={w}
            color={cellState === 'x' ? 'black' : 'red'}
            type={type}
            show
            customElement="div"
          />
        )}
      </S.Marker>
    </S.Wrapper>
  )
}
