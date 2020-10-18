import * as R from 'ramda'

import * as TestUtil from '../../util'

import * as Draw from '../../../src/state/matrixReducers/draw'

describe('Draw.drawTetKind', () => {

  it('basically works', () => {
    const cols = 10
    const rows = 10

    const state = {
      game: {
        bucket: TestUtil.makeEmptyBucket(cols, rows)
      }
    }

    const tet = {
      pos: [1, 3],
      points: [[2, 1], [3, 1], [4, 1], [4, 2]]
    }

    const nextState = Draw.drawTetKind(state)('T')(tet)

    const emptyRow = R.repeat(0, cols)
    const expectedRows = {
      '4': [0, 0, 0, 'T', 'T', 'T', 0, 0, 0, 0],
      '5': [0, 0, 0, 0, 0, 'T', 0, 0, 0, 0]
    }

    const transBucket = R.transpose(nextState.game.bucket)
    for (let i = 0; i < rows; i++) {
      const expectedRow = expectedRows[i]

      if (expectedRow) expect(transBucket[i]).toEqual(expectedRow)
      else expect(transBucket[i]).toEqual(emptyRow)
    }
  })
})
