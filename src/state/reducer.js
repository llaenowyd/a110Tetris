

import { Alert } from 'react-native'

import * as R from 'ramda'

import { getNextTet } from '../Random'

import { getInitialState } from './initialState'

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
          matchAction('nextTet'),
          R.over(
            R.lensPath(['game', 'nextTet']),
            getNextTet
          )
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
              nextMatrixStyle => style => R.assoc('matrix', nextMatrixStyle, style),
              style =>
                R.compose(
                  R.ifElse(
                    R.equals(1),
                    R.always(0),
                    R.add(1)
                  ),
                  R.prop('matrix')
                )(style)
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
          state =>
            (([rows, cols]) =>
              R.mergeLeft(
                R.pick(['style'], state),
                getInitialState(rows, cols)
              )
            )(
              R.path(['game', 'size'], state)
            )
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
