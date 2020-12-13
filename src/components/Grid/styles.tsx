import styled from 'styled-components'

export const Container = styled.div<{ opacity: number }>`
  opacity: ${({ opacity }) => opacity};
  transition: opacity 0.5s cubic-bezier(1, -0.11, 0, 1.08) 0.2s;
`

export const Wrapper = styled.div`
  display: grid;
  grid-template-columns: ${({ theme }) => `repeat(${theme.gridSize}, ${theme.cellWidth}px)`};
  grid-auto-rows: ${({ theme }) => theme.cellWidth}px;
  grid-gap: ${({ theme }) => theme.gridGap}px;
`
