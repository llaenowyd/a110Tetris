import * as R from 'ramda'

import * as TestUtil from './util'
import { makeTet, tetset } from '../src/tets'

import * as Bucket from '../src/bucket'

const drawPoints = (bucket, points, pos, kind) => {
  for (let i = 0; i < points.length; i++) {
    const point = points[i]
    const [pi, pj] = [point[0] + pos[0], point[1] + pos[1]]
    bucket[pi][pj] = kind
  }
  return bucket
}

describe('Bucket.completeRows', () => {
  const cols = 10
  const rows = 20

  it('basically works', () => {
    const state = {
      game: {
        bucket: TestUtil.makeEmptyBucket(cols, rows),
        actiTet: { points: [[0,0]], pos: [0,0] },
        completedRows: []
      }
    }

    let nextState = Bucket.completeRows(state)

    expect(nextState).toEqual(state)

    for (let i = 1; i < cols; i++) {
      state.game.bucket[i][0] = 'T'
    }

    drawPoints(state.game.bucket, state.game.actiTet.points, state.game.actiTet.pos, 'I')

    nextState = Bucket.completeRows(state)

    expect(nextState.game.actiTet).toEqual(state.game.actiTet)
    expect(nextState.game.bucket).toEqual(state.game.bucket)
    expect(nextState.game.completedRows).toEqual([0])
  })
})

describe.skip('Bucket.isFinished', () => {
  const cols = 10
  const rows = 20
  const makeTetCR = makeTet(cols, rows)

  const addRow = tetKind => R.map(R.append(tetKind))

  const addRows = (n, tetKind) =>
    bucket =>
      R.reduce(
        bucket => addRow(tetKind)(bucket),
        bucket,
        R.repeat(null, n)
      )

  it('detects game over when bucket is completely full', () => {
    const bucket = TestUtil.makeEmptyBucket(cols, rows+6, 'T')

    R.forEach(
      tetKind => {
        expect(Bucket.isFinished({
          game: {
            actiTet: makeTetCR(tetKind),
            bucket
          }
        })).toEqual(true)
      },
      tetset
    )
  })

  it('doesnt detect game over when bucket is filled only to view', () => {
    const bucket = addRows(6, 0)(TestUtil.makeEmptyBucket(cols, rows, 'T'))

    R.forEach(
      tetKind => {
        expect(Bucket.isFinished({
          game: {
            actiTet: makeTetCR(tetKind),
            bucket
          }
        })).toEqual(false)
      },
      tetset
    )
  })

  it('detects game over when bucket is filled one row beyond view', () => {
    const bucket =
      R.compose(
        addRows(5, 0),
        addRow('T')
      )(
        TestUtil.makeEmptyBucket(cols, rows, 'T')
      )

    R.forEach(
      tetKind => {
        expect(Bucket.isFinished({
          game: {
            actiTet: makeTetCR(tetKind),
            bucket
          }
        })).toEqual(true)
      },
      tetset
    )
  })
})
