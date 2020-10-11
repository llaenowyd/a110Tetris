import React from 'react'

import { useDispatch } from 'react-redux'

import {
  StyleSheet,
  View,
} from 'react-native';

import * as R from 'ramda'

import thunks from '../state/thunks'
import LittleButtonCluster from './LittleButtonCluster'
import Presser from './components/Presser'

const styles = StyleSheet.create({
  view: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'stretch',
    justifyContent: 'space-between'
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
    alignItems: 'stretch',
    justifyContent: 'flex-end',
    flexGrow: 1
  },
  littleCluster: {
    marginLeft: 40,
    marginRight: 40,
    marginTop: 10,
    marginBottom: 10
  },
  buttonPressed: {
    backgroundColor: '#6ae65f'
  },
  buttonUnpressed: {
    backgroundColor: '#216317'
  },
  cornerButton: {
    marginTop: 10
  }
})

const MainButton = props => {
  return (
    <Presser
      size="large"
      style={props.style}
      stylePressed={styles.buttonPressed}
      styleUnpressed={styles.buttonUnpressed}
      icon={props.icon}
      onPress={props.onPress}
    />
  )
}

const Controls = props => {
  const dispatch = useDispatch()

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