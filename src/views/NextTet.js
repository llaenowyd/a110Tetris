import React from 'react'

import {
  StyleSheet,
  Text,
  View
} from 'react-native'

import { useSelector } from 'react-redux'

import * as R from 'ramda'

import * as Tets from '../tets'

const styles = StyleSheet.create({
  nextTet: {
    position: 'relative',
    backgroundColor: 'lightblue'
  },
  littleGrid: {
    height: 100,
    width: 100,
    backgroundColor: 'grey',
    borderWidth: 1,
    borderColor: 'blue',
    display: 'flex'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    height: '25%'
  },
  cell: {
    width: '25%',
    backgroundColor: 'darkgrey',
    borderWidth: 0.5,
    borderColor: 'black'
  }
})

export default props => {
  const nextTetKind = useSelector(R.path(['game', 'nextTet']))

  const nextTet = Tets.create(nextTetKind)([0,0])
  const nextTetColor = nextTet.color

  const indexes = [0,1,2,3]

  return (
    <View style={R.mergeLeft(R.defaultTo({}, props.style), styles.nextTet)}>
      <Text>{`Next piece: ${nextTetKind}`}</Text>
      <Text>{JSON.stringify(nextTet.blocks)}</Text>
      <View style={styles.littleGrid}>
        {
          R.map(
            i => (
              <View key={i} style={styles.row}>
                {
                  R.map(
                    j => (
                      <View style={
                        R.mergeLeft(
                          R.includes([j,3-i], nextTet.blocks)
                            ? {backgroundColor: nextTetColor}
                            : {},
                          styles.cell
                        )} key={`${i},${j}`}
                      >

                      </View>
                    ),
                    indexes
                  )
                }
              </View>
            ),
            indexes
          )
        }
      </View>
    </View>
  )
}
