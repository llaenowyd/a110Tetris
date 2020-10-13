import * as R from 'ramda'

import {complement, logShade} from './fun/hexcolor'

export const darkCharcoal = '#101010'
export const lightCharcoal = '#202020'

export const darkOlive = '#1E261D'
export const lightOlive = '#5C7B57'

export const darkPlum = '#404055'
export const plum = '#646476'

export const forestGreen = '#216317'

export const block =
  R.map(
    ({primary}) => ({
      primary,
      shadow: logHexShade(primary, -0.35),
      highlight: logHexShade(primary, 0.35),
      complement: logHexShade(primary, 0)
    }),
    {
      I: {
        primary: '#00ffff',
      },
      J: {
        primary: '#0000ff'
      },
      L: {
        primary: '#ffa500'
      },
      O: {
        primary: '#ffff00'
      },
      S: {
        primary: '#00ff00'
      },
      T: {
        primary: '#9932cc'
      },
      Z: {
        primary: '#ff0000'
      }
    }
  )
