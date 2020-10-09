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

const pokeBucket =
  bucket =>
    (cols =>
      (i, j, k) =>
        { if (i>=0 && j>=0 && i < cols) bucket[i][j] = k }
    )(bucket.length)

const drawPoints = ({kind, points, pos}) =>
  R.over(
    R.lensPath(['game', 'bucket']),
    bucket =>
      (pokeBlock => {
        R.forEach(
          ([i,j]) =>
            (
              ([it, jt]) => { pokeBlock(it, jt, kind) }
            )(
              [pos[0]+i, pos[1]+j]
            ),
          points
        )
        return bucket
      })(pokeBucket(bucket))
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

const applyPos =
  R.chain(
    ([x,y]) =>
      R.compose(
        R.map(([i,j]) => [i+x,j+y]),
        R.prop('points')
      ),
    R.prop('pos')
  )

const isFloored =
  R.compose(
    R.any(
      ([_,y]) => y < 0
    ),
    applyPos
  )

const isOverlap =
  (bucket, maybeActiTet, prevActiTet) =>
    ((maybeActiPoints, prevActiPoints) =>
      R.any(
        ([i,j]) =>
          0 > R.findIndex(([ib,jb]) => ib===i && jb===j, prevActiPoints)
           && R.defaultTo('', bucket[i]?.[j]) !== 0
        )(maybeActiPoints)
    )(
      applyPos(maybeActiTet),
      applyPos(prevActiTet)
    )

const isCollision =
  (bucket, maybeActiTet, prevActiTet) =>
    isFloored(maybeActiTet) || isOverlap(bucket, maybeActiTet, prevActiTet)

export const fall =
  R.chain(
    ([bucket, prevActiTet]) =>
      R.chain(
        fellActiTet =>
          state =>
            isCollision(bucket, fellActiTet, prevActiTet)
              ? [state, false]
              : [
                R.compose(
                  R.set(R.lensPath(['game', 'actiTet']), fellActiTet),
                  drawPoints(fellActiTet),
                  clearPoints(prevActiTet)
                )(state),
                true
              ],
        () =>
          R.over(
            R.lensPath(['pos', 1]),
            R.add(-1)
          )(prevActiTet)
      ),
    R.juxt([
      R.path(['game', 'bucket']),
      R.path(['game', 'actiTet'])
    ])
  )

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
