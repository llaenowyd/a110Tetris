import React, { useEffect } from 'react'

import { useDispatch } from 'react-redux'

import {
  Alert,
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import * as R from 'ramda'

import thunks from '../state/thunks'
import Matrix from './Matrix'
import Presser from './components/Presser'

const styles = StyleSheet.create({
  view: {
    margin: 10,
    backgroundColor: 'aliceblue',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch'
  },
  matrix: {
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: null
  },
  buttonCluster: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexGrow: 0.05,
    flexShrink: 1,
    flexBasis: 'auto',
    paddingBottom: 10,
    backgroundColor: 'yellow'
  },
  centerColumn: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    backgroundColor: 'red',
    flexGrow: 1
  },
  littleButtonsRow: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'green'
  },
  littleButtonsCol: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
  },
  downView: {
  },
  downButton: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'stretch'
  },
  stackedButton: {
    marginBottom: 10
  },
  buttonRowOld: {
    height: '100%',
    paddingTop: 2,
    paddingBottom: 2,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto'
  },
  buttonRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    height: '100%',
    paddingTop: 2,
    paddingBottom: 2,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
    backgroundColor: 'purple'
  },
  leftButtonRow: {
    justifyContent: 'flex-start',
  },
  rightButtonRow: {
    justifyContent: 'flex-end',
  },
  bumper: {
    backgroundColor: 'orange',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    flexShrink: 1
  },
  leftBumper: {
    marginLeft: 5
  },
  rightBumper: {
    marginRight: 5
  },
  bumperButton: {
    flexGrow: 1,
    flexShrink: 0
  }
})

export default props => {
  const dispatch = useDispatch()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    dispatch(thunks.testPattern())
    return () => dispatch(thunks.stopTick())
  }, [])

  const handleTestPatternClick = () => dispatch(thunks.testPattern())
  const handleNewGameClick = () => dispatch(thunks.newGame())
  const handleResetClick = () => dispatch(thunks.reset())

  const handleToggleStyleClick = () => dispatch({
    type: 'toggleMatrixStyle',
    payload: { }
  })
  const handleLeftRotateClick = () => dispatch({type: 'inpLR'})
  const handleRightRotateClick = () => dispatch({type: 'inpRR'})
  const handleLeftClick = () => dispatch({type: 'inpL'})
  const handleRightClick = () => dispatch({type: 'inpR'})
  const handleDownClick = () => dispatch({type: 'inpD'})

  const viewStyle =
    R.mergeLeft(
      R.defaultTo({}, props.style),
      styles.view
    )

  return (
    <View style={viewStyle}>
      <Matrix style={styles.matrix} />
      <View style={styles.buttonCluster}>
        <View style={R.mergeLeft(styles.leftButtonRow, styles.buttonRow)}>
          <View style={R.mergeLeft(styles.bumper, styles.leftBumper)}>
            <Presser
              style={styles.bumperButton}
              icon="rotl"
              onPress={handleLeftRotateClick}
              size="large"
            />
            <Presser
              style={styles.bumperButton}
              icon="left"
              onPress={handleLeftClick}
              size="large"
            />
          </View>
        </View>
        <View style={styles.centerColumn}>
          <View style={styles.littleButtonsRow}>
            <View style={styles.littleButtonsCol}>
              <Presser
                style={styles.stackedButton}
                text="grid"
                onPress={handleToggleStyleClick}
                size="small"
              />
              <Presser
                style={styles.stackedButton}
                text="reset"
                onPress={handleResetClick}
                size="small"
              />
            </View>
            <View style={styles.littleButtonsCol}>
              <Presser
                style={styles.stackedButton}
                text="pattern"
                onPress={handleTestPatternClick}
                size="small"
              />
              <Presser
                style={styles.stackedButton}
                text="new game"
                onPress={handleNewGameClick}
                size="small"
              />
            </View>
          </View>
          <Presser
            icon="down"
            onPress={handleDownClick}
            size="large"
          />
        </View>
        <View style={R.mergeLeft(styles.rightButtonRow, styles.buttonRow)}>
          <View style={R.mergeLeft(styles.bumper, styles.rightBumper)}>
            <Presser
              icon="rotr"
              onPress={handleRightRotateClick}
              size="large"
            />
            <Presser
              icon="rite"
              onPress={handleRightClick}
              size="large"
            />
          </View>
        </View>
      </View>
    </View>
  )
}
