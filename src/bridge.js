import { makeMap } from './city'
import { DIMENSION, TILE } from './constant'
import { createPlayer } from './player'
import { setOnMap } from './utils'

let showNotifications

export const loadBridge = () => {
    loadRoot('assets/')
    loadSprite('fence-left', 'fence_left.png')
    loadSprite('fence-right', 'fence_right.png')
    loadSprite('fence-middle', 'fence_middle.png')
    loadSprite('bridge', 'bridge.png')
    loadSprite('bridge_floor', 'bridge_floor.png')
    loadSprite('truck', 'truck.png')
    loadSprite('road', 'road.png')
    loadSprite('bridgeNS', 'bridgeNS.png')
    loadSprite('counter', 'counter.png')
    loadSprite('water', 'water2.png')
    loadSprite('water_m', 'water_m.png')
    loadSprite('mailbox', 'mailbox.png')

    scene('bridge', ({ position, starting_animation }) => {
        layers(['bg', 'obj', 'ui'], 'obj')
        if (!starting_animation) starting_animation = 'idle-right'

        let map = makeMap({ x: DIMENSION.x / 2 - 4, y: DIMENSION.y / 2 - 16 })

        // border
        for (let i = 0; i < DIMENSION.y; i++) {
            map = setOnMap(map, 0, i, '*')
            map = setOnMap(map, map[0].length - 1, i, '*')
        }
        for (let i = 0; i < DIMENSION.x; i++) {
            map = setOnMap(map, i, 0, '*')
            map = setOnMap(map, i, map.length - 1, '*')
        }

        // water
        const water_pos = {
            start: 5,
            end: map[0].length-5 
        }
        for (let x=0; x<map[0].length;x++){
            if(x<water_pos.start || x>water_pos.end) continue
            for(let y=0; y< map.length; y++){
                if(y<1 || y>map.length-2)continue
                map = setOnMap(map, x, y, 'e')
            }
        }

        // bridge
        for (let x = 0; x < DIMENSION.y; x++) {
            if(x<water_pos.start || x>water_pos.end) continue
            map = setOnMap(map, x, 8, 'm')
        }
 
        for (let x = 0; x < DIMENSION.y; x++) {
            if(x<water_pos.start || x>water_pos.end) continue
            map = setOnMap(map, x, 9, 'b')
            map = setOnMap(map, x, 10, 'b')
            map = setOnMap(map, x, 11, 'b')
            map = setOnMap(map, x, 12, 'b')
        }


        map = setOnMap(map, water_pos.start, 10, 't')

        for (let x = 0; x < DIMENSION.y; x++) {
            if(x<water_pos.start || x>water_pos.end) continue
            map = setOnMap(map, x, 13, 'm')
        }

        for (let x = 0; x < DIMENSION.y; x++) {
            if(x<water_pos.start || x>water_pos.end) continue
            map = setOnMap(map, x, 14, 'f')
            map = setOnMap(map, x, 15, 'f')
        }

        for (let x = 0; x < DIMENSION.y; x++) {
            if(x<water_pos.start || x>water_pos.end) continue
            map = setOnMap(map, x, 16, 'm')
        }

        const levelCfg = {
            width: TILE.width,
            height: TILE.height,
            '*': () => [sprite('mb'), area(), solid(), scale(1.125)],
            ' ': () => [sprite('bg'), area(), 'wall', scale(1.125)],
            w: () => [sprite('water'), area(), solid(), scale(1.125)],
            n: () => [sprite('gate'), area(), 'wall', scale(1.125)],
            g: () => [sprite('gate'), area(), solid(), scale(1.125), 'gate'],
            l: () => [sprite('fence-left'), area(), solid(), scale(1.125)],
            r: () => [sprite('fence-right'), area(), solid(), scale(1.125)],
            m: () => [sprite('fence-middle'), area(), solid(), scale(1.125)],
            f: () => [sprite('bridgeNS'), area(), scale(1), scale(1.125)],
            e: () => [sprite('water_m'), area(), solid(), scale(1.125)],
            h: () => [sprite('mailbox'), area(), solid(), 'mailbox'],
            b: () => [sprite('road'), area(), solid(), scale(1.125)],
            c: () => [sprite('counter'), area(), solid(), scale(1), 'counter'],
            t: () => [
                sprite('truck'),
                area(),
                solid(),
                layer('ui'),
                scale(1.125),
            ],
        }

        addLevel(map, levelCfg)

        const player = createPlayer({ position, starting_animation })

        let bridge_text

        player.onCollide('counter', () => {
            destroy(bridge_text)

            bridge_text = add([
                text('Press b to Bridge tokens'),
                scale(0.5),
                layer('ui'),
                pos(player.pos.x, player.pos.y),
                lifespan(3, { fade: 2 }),
            ])

            const bridgeCounter = onKeyPress('b', () => {
                showNotifications = true
            })

            wait(3, () => {
                bridgeCounter()
            })
        })
    })
}
