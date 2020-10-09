import { Alert } from 'react-native'

import * as R from 'ramda'

import { makeTet } from '../tets'

import { getInitialState } from './initialState'
import { drawActiTet, leftRot, riteRot } from './matrixReducers'
import { tryCatcher } from './common'

const resetReducer =
  state =>
    (
      ([rows, cols]) =>
        R.mergeLeft(
          R.pick(['style'], state),
          getInitialState(rows, cols)
        )
    )(
      R.path(['game', 'size'], state)
    )

const inputReducer =
  tryCatcher('inputReducer')(
    key =>
      R.chain(
        R.set(R.lensProp('input')),
        R.compose(
          R.append(key),
          R.prop('input')
        )
      )
  )

export const reducer =
  (
    matchAction =>
      R.cond([
        [
          matchAction('newBag'),
          (state, action) =>
            (newBucket =>
              R.set(R.lensPath(['game', 'bucket']), newBucket, state)
            )(action.payload)
        ],
        [
          matchAction('setNextTet'),
          (state, {payload: [nextTet, bag]}) =>
            R.compose(
              R.set(
                R.lensPath(['game', 'nextTet']),
                nextTet
              ),
              R.set(
                R.lensPath(['game', 'bag']),
                bag
              )
            )(state)
        ],
        [
          matchAction('useNextTet'),
          tryCatcher('useNextTet')(
            R.compose(
              R.chain(
                R.set(R.lensPath(['game', 'actiTet', 'points'])),
                R.compose(
                  makeTet,
                  R.path(['game', 'actiTet', 'kind'])
                )
              ),
              R.chain(
                R.set(R.lensPath(['game', 'actiTet', 'kind'])),
                R.view(R.lensPath(['game', 'nextTet']))
              )
            )
          )
        ],
        [
          matchAction('drawActiTet'),
          drawActiTet
        ],
        [
          matchAction('inpLR'),
          inputReducer('L')
        ],
        [
          matchAction('inpRR'),
          inputReducer('R')
        ],
        [
          matchAction('inpNextTet'),
          inputReducer('N')
        ],
        [
          matchAction('leftRot'),
          R.compose(
            drawActiTet,
            leftRot
          )
        ],
        [
          matchAction('riteRot'),
          R.compose(
            drawActiTet,
            riteRot
          )
        ],
        [
          matchAction('clearInput'),
          tryCatcher('clearInput')(R.set(R.lensProp('input'), []))
        ],
        [
          matchAction('setBucket'),
          (state, action) =>
            R.set(
              R.lensPath(['game', 'bucket']),
              action.payload,
              state
            )
        ],
        [
          matchAction('setTick'),
          (state, {payload: tick}) => R.over(R.lensProp('tick'), R.always(tick))(state)
        ],
        [
          matchAction('toggleMatrixStyle'),
          R.over(
            R.lensPath(['style']),
            R.chain(
              nextMatrixStyle => R.assoc('matrix', nextMatrixStyle),
              R.compose(
                R.ifElse(
                  R.equals(1),
                  R.always(0),
                  R.add(1)
                ),
                R.prop('matrix')
              )
            )
          )
        ],
        [
          matchAction('startTimer'),
          (state, { payload: t0 }) =>
            R.over(
              R.lensProp('timer'),
              R.always({t0, t1: null})
            )(state)
        ],
        [
          matchAction('stopTimer'),
          (state, { payload: t1 }) =>
            R.compose(
              R.chain(
                diagnostic =>
                  R.over(R.lensProp('diagnostic'), R.always(diagnostic)),
                R.compose(
                  ({t0, t1}) => R.any(R.isNil)([t0, t1])
                    ? '???'
                    : `${t1 - t0}ms`,
                  R.prop('timer')
                )
              ),
              R.over(
                R.lensPath(['timer', 't1']),
                R.always(t1)
              )
            )(state)
        ],
        [
          matchAction('reset'),
          resetReducer
        ],
        [ R.T,
          (state, action) => {
            const actionType = action ? action.type : 'nil event'
            if ('@@redux/' !== R.take(8, actionType))
              Alert.alert('unexpected', `unknown event '${actionType}'`)
            return state
          }
        ]
      ])
  )(
    actionType => (state, action) =>
      R.compose(
        R.equals(actionType),
        R.prop('type')
      )(action)
  )
