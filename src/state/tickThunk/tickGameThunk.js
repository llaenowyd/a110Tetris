import * as R from 'ramda'

import { getNextTet } from '../../Random'
import { tryCatcher } from '../common'

const nextTetThunk =
  tryCatcher('nextTetThunk')(
    (dispatch, getState) =>
      R.compose(
        R.andThen(nextTet => dispatch({type: 'setNextTet', payload: nextTet})),
        getNextTet,
        R.path(['game', 'bag'])
      )(getState())
  )

const takeNextTetThunk =
  tryCatcher('takeNextTetThunk')(
    (dispatch, getState) => {
      dispatch({type: 'useNextTet'})
      dispatch({type: 'drawActiTet'})
      return nextTetThunk(dispatch, getState)
    }
  )

const handleInputThunk =
  tryCatcher('handleInputThunk')(
    (dispatch, getState) => {
      const {input} = getState()

      const doNextTet = R.complement(R.isNil)(R.find(R.equals('N'), input))
      const doLeftRot = R.complement(R.isNil)(R.find(R.equals('L'), input))
      const doRiteRot = R.complement(R.isNil)(R.find(R.equals('R'), input))

      return (
        doNextTet ?
          takeNextTetThunk(dispatch, getState)
          : Promise.resolve()
        ).then(
          () => {
            if (doLeftRot) dispatch({type: 'leftRot'})
            if (doRiteRot) dispatch({type: 'riteRot'})
            dispatch({type: 'clearInput'})
          }
        )
    }
  )

const tickGame = (dispatch, getState, checkpointIsIdle) => {
  const {game:{actiTet:{kind:actiKind}, nextTet}} = getState()

  return (
    R.isNil(nextTet)
      ? nextTetThunk(dispatch, getState)
      : Promise.resolve()
    ).then(
      () => R.isNil(actiKind)
        ? takeNextTetThunk(dispatch, getState)
        : () => null
    ).then(
      () => handleInputThunk(dispatch, getState)
    )
}

export default tickGame
