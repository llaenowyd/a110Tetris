import * as R from 'ramda'

export const drawActiTet = state => {
  const {game:{bucket, actiTet: {kind, points}, size:[rows, cols]}} = state

  const pos = 0

  for (let i = 0; i < rows*cols; i++)
    bucket[Math.floor(i/rows)][i%rows] = 'T'

  for (let i = 0; i < 25; i++) {
    bucket[pos + Math.floor(i/5)][pos + i%5] = 0
  }

  R.forEach(
    ([i,j]) => {
      bucket[pos + i][pos + j] = kind
    },
    points
  )

  return state
}

const quadrots =
  [
    ([i,j]) => [i, -1*j],
    ([i,j]) => [-1*i, j],
    ([i,j]) => [j, i],
    ([i,j]) => [-1*j, -1*i]
  ]

const rot1 =
  cw =>
    R.cond([
      [
        ([i,j]) => i > 0 && j > 0 || i < 0 && j < 0,
        quadrots[cw ? 0 : 1]
      ],
      [
        ([i,j]) => i > 0 && j < 0 || i < 0 && j > 0,
        quadrots[cw ? 1 : 0]
      ],
      [
        ([i,j]) => i === 0 || j !== 0,
        quadrots[cw ? 2 : 3]
      ],
      [
        ([i,j]) => i !== 0 || j === 0,
        quadrots[cw ? 3 : 2]
      ]
    ])

const rot = n => actiTet => {
  const {kind} = actiTet

  const [x,y] = [0,0]

  const r = kind === 'I' ? 2 : 1

  return R.over(
    R.lensProp('points'),
    R.map(
      R.compose(
        ([i, j]) => [i + x + r, j + y + r],
        R.apply(R.compose)(
          R.repeat(rot1(n > 0), Math.abs(n % 4))
        ),
        ([i, j]) => [i - x - r, j - y - r]
      )
    ),
    actiTet
  )
}

const rotate = n => R.over(R.lensPath(['game', 'actiTet']), rot(n))

export const leftRot = rotate(-1)

export const riteRot = rotate(1)
