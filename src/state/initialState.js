
import { getEmptyBucket } from '../bucket'

const clockRate = 8

export const initialActiTet = {
  kind: null,
  points: [],
  pos: [0,0],
  dropping: false
}

export const getInitialState = (rows=20, cols=10) =>
  ({
    clock: {
      diagnostic: null,
      rate: clockRate
    },
    game: {
      actiTet: initialActiTet,
      bag: [],
      bucket: getEmptyBucket(rows, cols),
      level: 1,
      clock: clockRate,
      nextTet: null,
      size: [cols, rows]
    },
    input: [],
    style: {
      matrix: 0
    },
    tick: {
      idle: true,
      interval: 100,
      mode: null,
      next: null,
      prevT0: null,
      skewDiagnostic: null
    }
  })
