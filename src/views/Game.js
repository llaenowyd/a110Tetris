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

const styles = StyleSheet.create({
  game: {
    backgroundColor: 'palegoldenrod'
  },
  button: {
    margin: 2,
    flexGrow: 1,
    flexShrink: 1
  },
  buttonRow: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    marginLeft: 32,
    marginRight: 32
  },
  matrix: {
    height: '100%',
    padding: 3
  }
})

export default props => {
  const dispatch = useDispatch()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => dispatch(thunks.stopTick()), [])

  const handleTestPatternClick = () => dispatch(thunks.testPattern())

  const handleNewGameClick = () => {}

  const handleResetClick = () => dispatch(thunks.reset())

  const handleToggleStyleClick = () => dispatch({
    type: 'toggleMatrixStyle',
    payload: { }
  })

  return (
    <>
      <View style={R.mergeLeft(styles.game, R.defaultTo({}, props.style))}>
        <Matrix style={styles.matrix} />
      </View>
      <View style={styles.buttonRow}>
        <View style={styles.button}>
          <Button
            title="test pattern"
            onPress={handleTestPatternClick}
          />
        </View>
        <View style={styles.button}>
          <Button
            title="new game"
            onPress={handleNewGameClick}
          />
        </View>
      </View>
      <View style={styles.buttonRow}>
        <View style={styles.button}>
          <Button
            title="toggle style"
            onPress={handleToggleStyleClick}
          />
        </View>
        <View style={styles.button}>
          <Button
            title="reset"
            onPress={handleResetClick}
          />
        </View>
      </View>
    </>
  )
}
