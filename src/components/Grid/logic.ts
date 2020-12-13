export type CellState = '_' | 'x' | 'o'
export type Player = 'human' | 'computer'

export type GameState = {
  winner: Player | null
  draw: boolean
  moveBy: Player
  cellStates: CellState[]
}

function rotate<T>(matrix: T[][]): T[][] {
  const out = []
  var origMatrix = matrix.slice()
  for (var i = 0; i < matrix.length; i++) {
    const row = matrix[i].map((x, j) => {
      var k = matrix.length - 1 - j
      return origMatrix[k][i]
    })
    out[i] = row
  }
  return out
}

function getDiagonals<T>(m: T[][]): T[][] {
  var s,
    x,
    y,
    d,
    o = []
  for (s = 0; s < m.length; s++) {
    d = []
    for (y = s, x = 0; y >= 0; y--, x++) d.push(m[y][x])
    o.push(d)
  }
  for (s = 1; s < m[0].length; s++) {
    d = []
    for (y = m.length - 1, x = s; x < m[0].length; y--, x++) d.push(m[y][x])
    o.push(d)
  }
  return o
}

export function findFreeCellIndexes(cellStates: CellState[]): number[] {
  const freeCellIndexes: number[] = []
  cellStates.forEach((cellState, i) => {
    if (cellState === '_') {
      freeCellIndexes.push(i)
    }
  })
  return freeCellIndexes
}

export function checkBoardIsFull(cellStates: CellState[]): boolean {
  return cellStates.every((token) => token !== '_')
}

export function checkWinner(cellStates: CellState[], n: number) {
  // n = Math.min(n, 5)
  const winNumber = n > 5 ? 5 : n
  // check vertically
  const verticalMatrix: CellState[][] = []
  for (let i = 0; i < n; i++) {
    verticalMatrix[i] = []
    for (let j = i; j < cellStates.length; j += n) {
      verticalMatrix[i].push(cellStates[j])
    }
  }

  // check horizontally
  const horizontalMatrix: CellState[][] = []
  for (let i = 0; i < cellStates.length; i++) {
    if (i % n === 0) {
      horizontalMatrix.push([])
    }
    horizontalMatrix[horizontalMatrix.length - 1].push(cellStates[i])
  }

  // check diagonally L
  const diagonalLMatrix: CellState[][] = getDiagonals(horizontalMatrix)

  // check diagonally R
  const diagonalRMatrix: CellState[][] = getDiagonals(rotate(horizontalMatrix))

  const isSameTokens = new RegExp(`([xo])\\1{${winNumber - 1},}`)

  // console.log([...verticalMatrix, ...horizontalMatrix, diagonalLArray, diagonalRArray])
  const [winnerTokens] = [...verticalMatrix, ...horizontalMatrix, ...diagonalLMatrix, ...diagonalRMatrix]
    .map((array) => array.join(''))
    .filter((tokens) => {
      // console.log(tokens, n, isSameTokens.test(tokens))
      return isSameTokens.test(tokens)
    })

  if (!winnerTokens) {
    return null
  }
  return winnerTokens.includes('x'.repeat(winNumber)) ? 'human' : 'computer'
}
