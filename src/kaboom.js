import kaboom from "kaboom"
import {DIMENSION, SCALE} from './constant'

kaboom({
    global: true,
    scale: SCALE,
    debug: true,
    background: [0,0,0,1],
    width: DIMENSION.x,
    height: DIMENSION.y
})

