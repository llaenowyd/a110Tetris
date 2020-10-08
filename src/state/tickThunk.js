import { Alert } from 'react-native'

import * as R from 'ramda'

import makeRange from '../fun/makeRange'
import { rand, safeRange } from '../Random'
import { tetset } from '../tets'

const catcher = tag => e => { throw new Error(`${tag} ${e.message}`) }
const tryCatcher = tag => f => R.tryCatch(f, catcher(tag))

const isntTickRunningMode = mode =>
  R.compose(
    R.not,
    tick => R.allPass(
      [
        R.compose(R.not, R.prop('idle')),
        R.propEq('mode', mode)
      ],
      tick
    )
  )

const tickTestPattern = (dispatch, getState, checkpointIsIdle) => {
  const { game, tick } = getState()
  const { bucket, size } = game
  const [rows, cols] = size
  const n = 20

  if (isntTickRunningMode('testPattern')(tick)) return Promise.resolve()

  const makeCheckpoint = curtail => res => checkpointIsIdle() ? curtail : res

  return R.pipeWith(
    R.andThen,
    [
      () => rand(3 * n),
      rx =>
        tryCatcher('1')(
          () =>
            R.map(
              i =>
                R.applySpec({
                  rowIndex: R.compose(
                    safeRange(rows),
                    R.nth(3 * i)
                  ),
                  colIndex: R.compose(
                    safeRange(cols),
                    R.nth(3 * i + 1)
                  ),
                  tet: R.compose(
                    R.flip(R.nth)(tetset),
                    safeRange(7),
                    R.nth(3 * i + 2)
                  )
                })(rx),
              makeRange(n)
            )
        )(),
      makeCheckpoint([]),
      adjs =>
        tryCatcher('2')(
          () =>
            R.reduce(
              (bucket, {rowIndex, colIndex, tet}) =>
                R.over(
                  R.lensIndex(colIndex),
                  R.set(R.lensIndex(rowIndex), tet)
                )(bucket),
              bucket,
              adjs
            )
        )(),
      makeCheckpoint(null),
      bucket => R.isNil(bucket) ? null : dispatch({type: 'setBucket', payload: bucket})
    ]
  )()
}

// const unsafeSnake = (dispatch, getState, checkpointIsIdle, context) => {
//   let { rows, cols, bucket, ps, it } = context
//
//   const gnt = () => {
//     const result = R.head(ps)
//     ps = R.append(result, R.tail(ps))
//     return result
//   }
//
//   const i = Math.floor(it / rows)
//   const j = it % rows
//
//   it++
//   if (it === rows*cols) it = 0
//
//   bucket[i][j] = gnt()
//
//   const unsafeStep = () => {
//     if (i > 0) throw new Error('unsafe step')
//   }
//
//   return Promise.resolve().then(
//     unsafeStep
//   ).then(
//     () => Promise.resolve(dispatch({type: 'setBucket', payload: bucket}))
//   ).then(
//     () => Promise.resolve()
//   )
// }

function tickThunk(dispatch, getState) {
  const { tick } = getState()
  const { mode, idle, interval, prevT0 } = tick

  const checkpointIsIdle = () => getState().tick.idle

  const t0 = Date.now()
  const externalSkew = t0 - prevT0 - interval

  const makeNoop = mode => () => Promise.resolve(R.once(() => { Alert.alert(`unknown mode '${mode}'`) })())

  return (
    ticker => R.defaultTo(makeNoop(mode), ticker)(dispatch, getState, checkpointIsIdle)
  )(
    R.flip(R.prop)({
      'testPattern': tickTestPattern
    })(mode)
  ).then(
    () => {
      const t1 = Date.now()
      const dt = t1 - t0
      const internalSkew = dt > interval ? dt - interval : 0
      const nextInterval =
        R.when(
          R.gte(0),
          skewedNextInterval => interval + skewedNextInterval % interval
        )(
          internalSkew === 0
            ? interval - dt - externalSkew
            : dt % interval - externalSkew
        )

      if (checkpointIsIdle()) return Promise.resolve()

      const next = idle ? null : setTimeout(() => dispatch(tickThunk), nextInterval)

      dispatch({
        type: 'setTick',
        payload: {
          mode,
          idle,
          next,
          prevT0: t0,
          skewDiagnostic: `${externalSkew}ms, ${dt}ms ${internalSkew}ms`,
          interval
        }
      })

      return Promise.resolve()
    }
  ).catch(
    e => Alert.alert('error', e.message)
  )
}

export default tickThunk
