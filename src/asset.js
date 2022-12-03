import { makeMap } from "./city"
import { DIMENSION } from "./constant"
import { createPlayer } from "./player"
import { setOnMap } from "./utils"

export const hallScene = () => {
    scene('hall', ({ position, starting_animation }) => {
        if (!position) {
            position = { x: DIMENSION.x / 4 - 8, y: DIMENSION.y / 2 - 36 }
        }
        if (!starting_animation) {
            starting_animation = 'idle-up'
        }

        layers(['bg', 'obj', 'ui'], 'obj')

        let map = makeMap({ x: DIMENSION.x / 2 - 4, y: DIMENSION.y / 2 - 4 })
        
        // border
        for (let i = 0; i < map.length; i++) {
            map = setOnMap(map, 0, i, '*')
            map = setOnMap(map, map[0].length - 1, i, '*')
        }
        for (let i = 0; i < map[0].length; i++) {
            map = setOnMap(map, i, 0, '*')
            map = setOnMap(map, i, map.length - 1, '*')
        }

        setOnMap(map, map[0].length / 2, map.length - 2, 'e')
        setOnMap(map, map[0].length / 2 - 1, map.length - 2, 'e')
        setOnMap(map, map[0].length / 2 + 1, map.length - 2, 'e')
        setOnMap(map, map[0].length / 2, map.length - 1, 'g')

        const levelCfg = {
            width: 16,
            height: 16,
            '*': () => [sprite('mb'), area(), solid()],
            ' ': () => [sprite('ht'), 'wall', scale(18 / 16)],
            g: () => [sprite('door'), area(), solid(), 'gate'],
            n: () => [sprite('door'), area(), solid()],
            N: () => [sprite('entry'), area(), 'nfts-entry'],
            a: () => [sprite('door'), area(), solid()],
            A: () => [sprite('entry'), area(), 'asset-entry'],
            e: () => [sprite('entry'), area(), 'exit'],
        }

        addLevel(map, levelCfg)

        const player = createPlayer({
            position,
            starting_animation,
        })

        const nft = add([
            text('NFT Room >'),
            scale(0.3),
            pos(DIMENSION.x / 2 - 175, NFT_ROOM_TEXT_HEIGHT),
            { value: 0 },
        ])

        changeRoom(player, 'exit', 'Press X to exit your room', () => {
            go('game', { position: entry_blocks.building })
        })

        changeRoom(player, 'asset-entry', 'Prexx X to see your asset', ()=>{
          go("asset", {})
        })

        changeRoom(
            player,
            'nfts-entry',
            'Press X to NFT room',
            () => {
                nftsScene()
                go('nfts', { position: { x: 32, y: NFT_ROOM_TEXT_HEIGHT } })
            },
            {
                x: -150,
                y: 15,
            }
        )
    })
}