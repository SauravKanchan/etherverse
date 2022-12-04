import { hallScene } from './home'
import { createBuilding, createCity } from './city'
import { DIMENSION, SCALE } from './constant'
import { createPlayer } from './player'
import { ENTRY_BLOCKS } from './store'
import { changeRoom } from './utils'

export const loadPolygon = () => {
    loadRoot('assets/')
    loadSprite('polygon_grass', 'polygon_grass.png')
    loadSprite('bb', 'building_bottom.png')
    loadSprite('mb', 'building_middle.png')
    loadSprite('door', 'door.png')
    loadSprite('window', 'window.png')
    loadSpriteAtlas('player.png', 'player.json')
    loadSprite('brick', 'brick.png')
    loadSprite('ht', 'house_tile.png')
    loadSprite('bg', 'grass.png')
    loadSprite('ethtile', 'eth.png')
    loadSprite('gate', 'gate.png')
    loadSprite('player', 'player.png')
    loadSprite('stone-wall', 'stone-wall.png')
    loadSprite('brown-floor', 'brown-floor.png')
    loadSprite('cream-floor', 'cream-floor.png')
    loadSprite('nft1', 'arcane.jpeg')
    loadSprite('nft2', 'nft2.png')
    loadSprite('entry', 'entry_block.png')
    scene('polygon', ({ position }) => {
        layers(['bg', 'obj', 'ui'], 'obj')
        let { map, levelCfg } = createCity(true)
        createBuilding(map)
        addLevel(map, levelCfg)
        const entry_pos = get('building_entry')[1]
            .inspect()
            .pos.replaceAll(' ', '')
            .replaceAll('(', '')
            .replaceAll(')', '')
            .split(',')
        ENTRY_BLOCKS.update((d) => {
            d.building = {
                x: parseInt(entry_pos[0]),
                y: parseInt(entry_pos[1]),
            }
            return d
        })

        const player = createPlayer({
            position,
            starting_animation: 'idle-down',
        })

        player.setScale(SCALE)

        changeRoom(
            player,
            'building_entry',
            'Press X to enter your room',
            () => {
                hallScene()
                go('hall', { city: 'polygon' })
            }
        )

        let one_time = action(() => {
            if (player.pos.x <= 0) {
                go('bridge', {
                    position: { x: DIMENSION.x / 2, y: player.pos.y },
                })
                one_time()
            }
        })
    })
}
