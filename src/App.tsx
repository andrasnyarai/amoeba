import React, { useState } from 'react'
import { createGlobalStyle, ThemeProvider } from 'styled-components'
import { Grid } from './components/Grid/Grid'

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font: normal normal bold 14px/20px Roboto;

    display: flex;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    align-items: center;
    justify-content: center;
  }

`
const gridGap = 3

function App() {
  const [gridSize, setGridSize] = useState(7)
  const theme = {
    gridSize,
    setGridSize,
    cellWidth: 100,
    gridGap,
    gridGapHalf: gridGap / 2,
  }

  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Grid />
      </ThemeProvider>
    </>
  )
}

export default App
