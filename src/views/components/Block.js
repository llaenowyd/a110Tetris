import React from 'react'
import {Animated, StyleSheet, View} from 'react-native'
import {useSelector} from 'react-redux'
import * as R from 'ramda'

import renameKeys from '../../fun/renameKeys'
import { tetset } from '../../tets'

import { block as blockTheme } from '../../theme.js'

const rawCommonBlockStyle = {
  flexGrow: 1,
  borderStyle: 'solid',
  borderWidth: 4,
  borderRadius: 4
}

const annoBlockStyle = {
  fontFamily: 'VT323-Regular',
  fontWeight: '900',
  textAlign: 'center',
  paddingTop: 3
}

const blockStyleForEmpty = {
  borderColor: 'rgba(255, 255, 255, 0)',
  opacity: 0.3
}

const getBlockStyleForTetKind =
  R.compose(
    R.applySpec({
      backgroundColor: R.prop('primary'),
      color: R.prop('complement'),
      borderTopColor: R.prop('highlight'),
      borderRightColor: R.prop('shadow'),
      borderBottomColor: R.prop('shadow'),
      borderLeftColor: R.prop('highlight')
    }),
    R.flip(R.prop)(blockTheme)
  )

const blockStyles =
  R.compose(
    R.fromPairs,
    R.map(
      tetKind =>
        [
          tetKind,
          R.mergeLeft(
            getBlockStyleForTetKind(tetKind),
            rawCommonBlockStyle
          )
        ]
    )
  )(tetset)

const flashBlockStyles =
  R.compose(
    renameKeys(
      R.compose(
        R.fromPairs,
        R.map(
          tet => [tet, R.concat('f', tet)]
        )
      )(tetset)
    ),
    R.fromPairs,
    R.map(
      ([tetKind, style]) => [
          tetKind,
          R.mergeLeft(
            {
              backgroundColor: blockTheme[tetKind].complement,
              opacity: 0
            }
          )
        ]
    ),
    R.toPairs
  )(
    blockStyles
  )

const emptyBlockStyle =
  R.mergeLeft(
    blockStyleForEmpty,
    rawCommonBlockStyle
  )

const annoBlockStyles =
  R.compose(
    renameKeys(
      R.compose(
        R.fromPairs,
        R.map(
          tet => [tet, R.concat('a', tet)]
        )
      )(tetset)
    ),
    R.map(
      R.mergeLeft(annoBlockStyle)
    )
  )(blockStyles)

const emptyAnnoBlockStyle =
  R.mergeLeft(
    R.mergeRight(
      annoBlockStyle,
      {
        color: 'darkgrey'
      }
    ),
    emptyBlockStyle
  )

const styles = StyleSheet.create({
  MT: emptyBlockStyle,
  aMT: emptyAnnoBlockStyle,
  ...blockStyles,
  ...annoBlockStyles
})

export default ({i, j, isCompleted}) => {
  const matrixStyle = useSelector(R.path(['style', 'matrix']))
  const tetKind = useSelector(R.path(['game', 'bucket', i, j]))
  const flash = useSelector(R.path(['game', 'flash', j]))

  const flashTimer = flash.timer

  const styleKey =
    R.compose(
      R.when(
        R.thunkify(R.equals(1))(matrixStyle),
        R.concat('a')
      ),
      R.when(
        R.equals(0),
        R.always('MT')
      )
    )(tetKind)

  const topStyle = styles[styleKey]

  const bottomStyle = R.defaultTo({}, flashBlockStyles[tetKind])

  const opacities = isCompleted && flashTimer ? [
      {
        opacity: flashTimer.interpolate({
          inputRange: [0, 100],
          outputRange: [0, 0.5]
        })
      },
      {
        opacity: flashTimer.interpolate({
          inputRange: [0, 100],
          outputRange: [0.5, 0]
        })
      },
    ] : [
      {
        opacity: 0.5
      },
      {
        opacity: 0
      }
    ]

  return {
    0: () => (
      <Animated.View style={[topStyle, opacities[0]]}>
        <Animated.View style={[bottomStyle, opacities[1]]} />
      </Animated.View>
    ),
    1: () => (
      <Animated.View style={[topStyle, opacities[0]]}>
        <Animated.Text style={[bottomStyle, opacities[1]]}>
          {tetKind}
        </Animated.Text>
      </Animated.View>
    )
  }[matrixStyle]()
}
