import * as R from 'ramda'

export const drawActiTet = state => {
  const {game:{bucket, actiTet: {kind, points, pos}}} = state

  const [x, y] = pos

  R.forEach(
    ([i,j]) => {
      bucket[x + i][y + j] = kind
    },
    points
  )

  return state
}

const setBucket =
  bucket =>
    (cols =>
      (i, j, k) =>
        { if (i>=0 && j>=0 && i < cols) bucket[i][j] = k }
    )(bucket.length)

const drawPoints = ({kind, points, pos}) =>
  R.over(
    R.lensPath(['game', 'bucket']),
    bucket =>
      (setBucket => {
        R.forEach(
          ([i,j]) =>
            (
              ([it, jt]) => { setBucket(it, jt, kind) }
            )(
              [pos[0]+i, pos[1]+j]
            ),
          points
        )
        return bucket
      })(setBucket(bucket))
  )

const clearPoints = ({points, pos}) => drawPoints({kind: 0, points, pos})

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

const rot = (n, actiTet) => {
  const {kind} = actiTet

  const r = kind === 'I' ? 2 : 1

  return R.over(
    R.lensProp('points'),
    R.map(
      R.compose(
        ([i, j]) => [i + r, j + r],
        R.apply(R.compose)(
          R.repeat(rot1(n > 0), Math.abs(n % 4))
        ),
        ([i, j]) => [i - r, j - r]
      )
    ),
    actiTet
  )
}

const rotate = n => state => {
  const {game:{actiTet}} = state
  const nextActiTet = rot(n, actiTet)

  return R.compose(
    R.set(R.lensPath(['game', 'actiTet']), nextActiTet),
    drawPoints(nextActiTet),
    clearPoints(actiTet)
  )(state)
}

export const leftRot = rotate(-1)

export const riteRot = rotate(1)

const isCollision = (state, maybeNextActiTet) => false

const translate =
  (axIndex, op) =>
    state =>
      (([actiTet, nextActiTet]) =>
        R.compose(
          drawPoints(nextActiTet),
          R.set(R.lensPath(['game', 'actiTet']), nextActiTet),
          clearPoints(actiTet)
        )(state)
      )((
        actiTet => [
          actiTet,
          R.over(
            R.lensPath(['pos', axIndex]),
            op
          )(actiTet)
        ]
      )(
        R.path(['game', 'actiTet'])(state)
      ))

export const left = translate(0, R.add(-1))

export const rite = translate(0, R.add(1))

export const up = translate(1, R.add(1))

export const down = translate(1, R.add(-1))
