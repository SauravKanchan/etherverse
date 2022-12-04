import { DIMENSION, SCALE, TILE } from './constant'
import { setOnMap } from './utils'

export const makeMap = (dimension = DIMENSION) => {
    let map = []
    let row = ''
    for (let x = 0; x < dimension.x / TILE.width; x++) {
        row += ' '
    }
    for (let y = 0; y < dimension.y / TILE.width; y++) {
        map.push(row)
    }

    return map
}

export const createCity = (polygon = false) => {
    let map = makeMap()

    const levelCfg = {
        width: TILE.width,
        height: TILE.height,
        ' ': () => [
            sprite(polygon ? 'polygon_grass' : 'grass'),
            scale(1.25),
            layer('bg'),
        ],
        '#': () => [sprite('mb'), area(), solid()],
        '-': () => [sprite('bb'), area(), solid()],
        '!': () => [sprite('door'), area(), solid(), 'building_door'],
        w: () => [sprite('window')],
        e: () => [sprite('entry'), area(), 'building_entry'],
    }

    return { map, levelCfg }
}

export const createBuilding = (map) => {
    const BUILDING_START = { x: 10, y: 5 }
    const BUILDING_DIMENSION = { width: 11, height: 10 }
    for (let x = 0; x < BUILDING_DIMENSION.width; x++) {
        for (let y = 0; y < BUILDING_DIMENSION.height; y++) {
            map = setOnMap(map, BUILDING_START.x + x, BUILDING_START.y + y, '#')
        }
    }
    for (let x = 0; x < BUILDING_DIMENSION.width; x++) {
        map = setOnMap(
            map,
            BUILDING_START.x + x,
            BUILDING_START.y + BUILDING_DIMENSION.height,
            '-'
        )
    }

    setOnMap(
        map,
        BUILDING_START.x + Math.floor(BUILDING_DIMENSION.width / 2),
        BUILDING_START.y + BUILDING_DIMENSION.height,
        '!'
    )
    setOnMap(
        map,
        BUILDING_START.x + Math.floor(BUILDING_DIMENSION.width / 2),
        BUILDING_START.y + BUILDING_DIMENSION.height + 1,
        'e'
    )
    setOnMap(
        map,
        BUILDING_START.x + Math.floor(BUILDING_DIMENSION.width / 2) - 1,
        BUILDING_START.y + BUILDING_DIMENSION.height + 1,
        'e'
    )
    setOnMap(
        map,
        BUILDING_START.x + Math.floor(BUILDING_DIMENSION.width / 2) + 1,
        BUILDING_START.y + BUILDING_DIMENSION.height + 1,
        'e'
    )

    setOnMap(
        map,
        BUILDING_START.x + Math.floor(BUILDING_DIMENSION.width / 2) - 3,
        BUILDING_START.y + BUILDING_DIMENSION.height - 2,
        'w'
    )
    setOnMap(
        map,
        BUILDING_START.x + Math.floor(BUILDING_DIMENSION.width / 2) + 3,
        BUILDING_START.y + BUILDING_DIMENSION.height - 2,
        'w'
    )

    setOnMap(
        map,
        BUILDING_START.x + Math.floor(BUILDING_DIMENSION.width / 2) - 3,
        BUILDING_START.y + BUILDING_DIMENSION.height - 4,
        'w'
    )
    setOnMap(
        map,
        BUILDING_START.x + Math.floor(BUILDING_DIMENSION.width / 2) + 3,
        BUILDING_START.y + BUILDING_DIMENSION.height - 4,
        'w'
    )

    setOnMap(
        map,
        BUILDING_START.x + Math.floor(BUILDING_DIMENSION.width / 2) - 3,
        BUILDING_START.y + BUILDING_DIMENSION.height - 6,
        'w'
    )
    setOnMap(
        map,
        BUILDING_START.x + Math.floor(BUILDING_DIMENSION.width / 2) + 3,
        BUILDING_START.y + BUILDING_DIMENSION.height - 6,
        'w'
    )

    setOnMap(
        map,
        BUILDING_START.x + Math.floor(BUILDING_DIMENSION.width / 2) - 3,
        BUILDING_START.y + BUILDING_DIMENSION.height - 8,
        'w'
    )
    setOnMap(
        map,
        BUILDING_START.x + Math.floor(BUILDING_DIMENSION.width / 2) + 3,
        BUILDING_START.y + BUILDING_DIMENSION.height - 8,
        'w'
    )
}
