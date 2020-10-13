import * as R from 'ramda'

const taglog = tag => x => { console.log(tag, x); return x }
const baglog = (color, ratio, tag) => x =>
  { if (color === '#0000ff' || color === '#ff0000' && ratio < 0) console.log(tag, x); return x }

const zeropadTo6Digs =
    str =>
      R.concat(
        R.compose(
          R.join(''),
          R.repeat('0')
        )(
          6 - R.length(str)
        ),
        str
      )

const hexColorToColorComponents =
  R.compose(
    R.juxt([
      c => c >> 16,
      c => c >> 8 & 0x00FF,
      c => c & 0x0000FF
    ]),
    x => parseInt(x, 16),
    R.drop(1)
  )

const adjustedComponentsToHexColor =
  adjustedComponents =>
    R.concat(
      '#',
      R.compose(
        zeropadTo6Digs,
        x => x.toString(16),
        R.reduce(R.add, 0),
        R.map(R.apply(R.applyTo))
      )(
        R.transpose([
          adjustedComponents,
          [
            R.multiply(0x10000),
            R.multiply(0x100),
            R.identity
          ]
        ])
      )
    )

export const linearShade =
  R.ifElse(
    (_, ratio) => ratio === 0,
    R.identity,
    (color, ratio) =>
      ((rgb, blendComponent) =>
        R.compose(
          adjustedComponentsToHexColor,
          R.map(blendComponent)
        )(rgb)
      )(
        hexColorToColorComponents(color),
        ((absRatio, blendWithComponent) =>
          compC =>
            Math.round(
              (blendWithComponent - compC) * absRatio
            ) + compC
        )(
          ratio < 0 ? -1 * ratio : ratio,
          ratio < 0 ? 0 : 255
        )
      )
  )

export const logShade =
    (color, ratio) =>
      ((rgb, isDarkening) =>
        ((t, p) =>
          R.compose(
            adjustedComponentsToHexColor,
            R.map(
              comp => Math.round(p * comp ** 2 + t) ** 0.5,
              rgb
            )
          )(rgb)
        )(
          isDarkening ? 0 : ratio * 255 ** 2,
          isDarkening ? 1 + ratio : 1 - ratio
        )
      )(
        hexColorToColorComponents(color),
        ratio < 0
      )

export const complement =
  color =>
    (C =>
        (([components, max, min]) => {
          let [r,g,b] = components
          let h
          let s
          let l = (max + min) / 2

          if (max === min) {
            h = s = 0
          }
          else {
            const d = max - min

            s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

            h =
              R.compose(
                R.flip(R.divide)(360),
                R.when(
                  R.lt(360),
                  R.add(-360)
                )
              )(
                1.0472 * (
                  max === r
                    ? (g - b) / d + (g < b ? 6.2832: 0)
                    : max === g
                    ? (b - r) / d + 2.0944
                    : (r - g) / d + 4.1888
                ) / 6.2832 * 360 + 180
              )

            if (s === 0) {
              r = g = b = l
            } else {
              const hue2rgb = (p, q, t) =>
                (tFixed =>
                    tFixed < 1/6
                      ? p + (q - p) * 6 * tFixed
                      : tFixed < 1/2
                      ? q
                      : tFixed < 2/3
                        ? p + (q - p) * (2/3 - t) * 6
                        : p
                )(
                  t < 0
                    ? t + 1
                    : t > 1
                    ? t - 1
                    : t
                )

              const q =
                l < 0.5
                  ? l * (1 + s)
                  : l + s - l * s

              const p = 2 * l - q;

              r = hue2rgb(p, q, h + 1/3);
              g = hue2rgb(p, q, h);
              b = hue2rgb(p, q, h - 1/3);
            }
          }

          return R.append(
            R.compose(
              x => x.toString(16),
              R.reduce(R.add, 0),
              R.unapply(R.applyTo)
            )(
              R.transpose(
                [r, g, b],
                [
                  R.multiply(0x10000),
                  R.multiply(0x100),
                  R.identity
                ]
              )
            ),
            r < 0x10 ? '#0' : '#'
          )
        })(
          R.compose(
            R.juxt([
              R.identity,
              R.max,
              R.min
            ]),
            R.map(R.flip(R.divide)(255)),
            R.juxt([
              C >> 16,
              C >> 8 & 0x00FF,
              C & 0x0000FF
            ])
          )(C)
        )
    )(
      R.compose(
        x => parseInt(x, 16),
        R.drop(1)
      )(color)
    )
