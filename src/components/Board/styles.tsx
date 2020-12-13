import styled from 'styled-components'

type LineProps = {
  i: number
  horizontal?: boolean
}

export const Wrapper = styled.div`
  position: relative;
`

const LineWithCircles = styled.div<LineProps>`
  ${({ horizontal, theme }) => {
    return `
        content: '';
        display: inline-block;
        width: ${theme.gridGap}px;
        height: ${theme.gridGap}px;
        border-radius: ${theme.gridGapHalf}px;
        background-color: black;
        position: absolute;
    `
  }}
`

export const Line = styled(LineWithCircles)<LineProps>`
  position: absolute;
  background-color: black;

  ${({ i, horizontal, theme }) => {
    const longDimension = theme.gridSize * theme.cellWidth + (theme.gridSize - 1) * theme.gridGap
    const translatedValue = i * theme.cellWidth + (i - 1) * theme.gridGap
    if (horizontal) {
      return `
        height: ${theme.gridGap}px;
        width: ${longDimension}px;
        top: ${translatedValue}px;
        `
    } else {
      return `
        width: ${theme.gridGap}px;
        height: ${longDimension}px;
        left: ${translatedValue}px;
        `
    }
  }}
`
