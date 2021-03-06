import * as R from 'ramda'

import makeRange from '../fun/makeRange'

const actionNames = {
  setTick: 'setTick',
  stopTick: 'stopTick',
  clockTick: 'clockTick',
  fall: 'fall',
  fallIfFalling: 'fallIfFalling',
  setNextTet: 'setNextTet',
  useNextTet: 'useNextTet',
  clearInput: 'clearInput',
  inpLR: 'inpLR',
  inpRR: 'inpRR',
  inpL: 'inpL',
  inpR: 'inpR',
  inpD: 'inpD',
  leftRot: 'leftRot',
  riteRot: 'riteRot',
  left: 'left',
  rite: 'rite',
  down: 'down',
  clearCompletedRows: 'clearCompletedRows',
  reset: 'reset',
  setBucket: 'setBucket',
  toggleMatrixStyle: 'toggleMatrixStyle',
  setupNewGame: 'setupNewGame',
  toggleMusic: 'toggleMusic'
}

// map< actionName, actionId >
export const actions =
  R.compose(
    R.fromPairs,
    R.chain(
      ids => keys => R.transpose([keys, ids]),
      R.compose(
        makeRange,
        R.length
      )
    ),
    R.keys
  )(actionNames)

// list< actionName >
const reverseLookup =
  R.compose(
    R.map(R.head),
    R.sort(([,id1], [,id2]) => id1 - id2),
    R.toPairs
  )(actions)

// actionId -> actionName
export const getActionName = R.flip(R.nth)(reverseLookup)
