import React from 'react'

import { useDispatch } from 'react-redux'

import {
  StyleSheet,
  View
} from 'react-native';

import * as R from 'ramda'

import LittleButtonCluster from './LittleButtonCluster'
import Presser from './components/Presser'

import { actions } from '../state/actions'
import { themes } from '../theme'

const themeName = 'arcade'
const {controls:controlsTheme} = themes[themeName]

const styles = StyleSheet.create({
  view: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    backgroundColor: controlsTheme.background
  },
  leftBumper: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    alignItems: 'stretch',
    justifyContent: 'flex-end',
    marginLeft: 5,
    marginRight: 10
  },
  rightBumper: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    alignItems: 'stretch',
    justifyContent: 'flex-end',
    marginRight: 5,
    marginLeft: 10
  },
  center: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    justifyContent: 'flex-end',
    flexGrow: 1,
    flexShrink: 1
  },
  littleCluster: {
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'center'
  },
  mainButton: {
    borderColor: controlsTheme.button.borderColor
  },
  downButton: {
    alignSelf: 'stretch'
  },
  buttonPressed: {
    backgroundColor: controlsTheme.buttonActive.background
  },
  buttonUnpressed: {
    backgroundColor: controlsTheme.button.background
  },
  cornerButton: {
    marginTop: 10
  }
})

const MainButton = props => {
  return (
    <Presser
      size="large"
      style={R.mergeLeft(styles.mainButton, props.style)}
      stylePressed={styles.buttonPressed}
      styleUnpressed={styles.buttonUnpressed}
      icon={props.icon}
      onPress={props.onPress}
    />
  )
}

const Controls = props => {
  const dispatch = useDispatch()

  const handleLeftRotateClick = () => dispatch({type: actions.inpLR})
  const handleRightRotateClick = () => dispatch({type: actions.inpRR})
  const handleLeftClick = () => dispatch({type: actions.inpL})
  const handleRightClick = () => dispatch({type: actions.inpR})
  const handleDownClick = () => dispatch({type: actions.inpD})

  const viewStyle =
    R.mergeLeft(
      R.defaultTo({}, props.style),
      styles.view
    )

  return (
    <View style={viewStyle}>
      <View style={styles.leftBumper}>
        <MainButton
          icon="rotl"
          onPress={handleLeftRotateClick}
        />
        <MainButton
          style={styles.cornerButton}
          icon="left"
          onPress={handleLeftClick}
        />
      </View>
      <View style={styles.center}>
        <LittleButtonCluster style={styles.littleCluster} />
        <MainButton
          style={styles.downButton}
          icon="down"
          onPress={handleDownClick}
        />
      </View>
      <View style={styles.rightBumper}>
        <MainButton
          icon="rotr"
          onPress={handleRightRotateClick}
        />
        <MainButton
          style={styles.cornerButton}
          icon="rite"
          onPress={handleRightClick}
        />
      </View>
    </View>
  )
}

export default Controls
