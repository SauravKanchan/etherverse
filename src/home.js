import { makeMap } from './city'
import { DIMENSION, SCALE, TILE } from './constant'
import { createPlayer } from './player'
import { ENTRY_BLOCKS } from './store'
import { changeRoom, setOnMap } from './utils'

import { IS_LOCK } from './store.js'
let lock

IS_LOCK.subscribe((value) => {
    lock = value
})

let entry_blocks
ENTRY_BLOCKS.subscribe((d) => {
    entry_blocks = d
})

const NFT_ROOM_DOOR_ROW = 8
const NFT_ROOM_TEXT_HEIGHT = 125
let continuation
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

        setOnMap(map, map[0].length - 1, NFT_ROOM_DOOR_ROW, 'n')
        setOnMap(map, map[0].length - 2, NFT_ROOM_DOOR_ROW - 1, 'N')
        setOnMap(map, map[0].length - 2, NFT_ROOM_DOOR_ROW, 'N')
        setOnMap(map, map[0].length - 2, NFT_ROOM_DOOR_ROW + 1, 'N')
        
        setOnMap(map, 0, NFT_ROOM_DOOR_ROW, 'a')
        setOnMap(map, 1, NFT_ROOM_DOOR_ROW - 1, 'A')
        setOnMap(map, 1, NFT_ROOM_DOOR_ROW, 'A')
        setOnMap(map, 1, NFT_ROOM_DOOR_ROW + 1, 'A')

        //ENS Office
        setOnMap(map, map[0].length / 2,  1, 's')
        setOnMap(map, map[0].length / 2 - 1,  1, 's')
        setOnMap(map, map[0].length / 2 + 1, 1, 's')
        setOnMap(map, map[0].length / 2, 0, 'S')


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
            s: () => [sprite('entry'), area(), 'ens-entry'],
            S: () => [sprite('door'), area(), 'ensOffice'],

        }

        addLevel(map, levelCfg)

        const nft_pos = get('nfts-entry')[1]
            .inspect()
            .pos.replaceAll(' ', '')
            .replaceAll('(', '')
            .replaceAll(')', '')
            .split(',')

        ENTRY_BLOCKS.update((d) => {
            d.nft = {
                x: parseInt(nft_pos[0]),
                y: parseInt(nft_pos[1]),
            }
            return d
        })

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

        changeRoom(player, 'asset-entry', 'Press X to see your asset', ()=>{
          go("assets", {})
        })

        changeRoom(player, 'ens-entry', 'Press X to check ENS Details', ()=>{
            go("ensOffice", { position: {x:  map[0].length / 2 - 1, y: map.length - 2 }  })
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

export const nftsScene = () => {
    scene('nfts', ({ position, starting_animation }) => {
        if (!position) {
            position = { x: 32, y: NFT_ROOM_TEXT_HEIGHT }
        }
        if (!starting_animation) {
            starting_animation = 'idle-right'
        }
        layers(['bg', 'obj', 'ui'], 'obj')
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

        setOnMap(map, 0, NFT_ROOM_DOOR_ROW, 'n')
        setOnMap(map, 1, NFT_ROOM_DOOR_ROW - 1, 'N')
        setOnMap(map, 1, NFT_ROOM_DOOR_ROW, 'N')
        setOnMap(map, 1, NFT_ROOM_DOOR_ROW + 1, 'N')

        const NFT_START = {
            x: 64,
            y: 32,
        }
        const NFT_COUNT = 20
        let page = ''
        const NFT_PER_ROW = 6
        const levelCfg = {
            width: 16,
            height: 16,
            '*': () => [sprite('stone-wall'), area(), solid()],
            ' ': () => [sprite('cream-floor'), area(), 'wall'],
            1: () => [sprite('nft1'), area(), scale(0.5), z(1), 'nft1'],
            2: () => [sprite('nft2'), area(), scale(3), z(1)],
            n: () => [sprite('door'), area(), solid(), scale(1), 'gate'],
            N: () => [sprite('entry'), area(), 'hall-entry'],
        }

        addLevel(map, levelCfg)

        const player = createPlayer({
            position,
            starting_animation,
        })

        changeRoom(player, 'hall-entry', 'Press x to go to hall', () => {
            hallScene()
            go('hall', {
                position: entry_blocks.nft,
                starting_animation: 'idle-left',
            })
        })

        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: ' e7fc089c-a88f-4c6f-b914-197c3e65d89f',
            },
        }

        loadRoot('')
        fetch(
            `https://api.nftport.xyz/v0/accounts/0x5555763613a12D8F3e73be831DFf8598089d3dCa?chain=ethereum&page_size=50&include=metadata&page_size=${NFT_COUNT}&continuation=${page}`,
            options
        )
            .then((response) => response.json())
            .then((response) => {
                let x = NFT_START.x
                let y = NFT_START.y
                let c = 0
                continuation = response.continuation
                for (let i = 0; i < response.nfts.length; i++) {
                    let nft = response.nfts[i]
                    let name = `${nft['contract_address']}-${nft['token_id']}`
                    const ZOOM = 4
                    if (!nft['file_url']) continue
                    loadSprite(name, nft['file_url']).then((d) => {
                        let nft_obj = add([
                            layer('obj'),
                            sprite(name),
                            pos(x, y),
                            area(),
                            scale(
                                (ZOOM * TILE.width) / d.tex.width,
                                (ZOOM * TILE.height) / d.tex.height
                            ),
                            solid(),
                            name,
                        ])
                        x += 96
                        if (c % 6 == 5) {
                            y += 96
                            x = NFT_START.x
                        }
                        c++

                        player.onCollide(name, (d) => {
                            if (lock) return
                            // @ts-ignore
                            if (player.text?.parent) {
                                // @ts-ignore
                                player.text = add([
                                    text(nft['name']),
                                    scale(0.2),
                                    layer('ui'),
                                    pos(player.pos.x, player.pos.y),
                                    lifespan(3, { fade: 2 }),
                                ])
                            }
                        })

                        onKeyPress('x', () => {
                            if (lock) return
                            get(name).forEach((g) => {
                                if (player.isTouching(g)) {
                                    window.open(
                                        `https://opensea.io/assets/ethereum/${nft['contract_address']}/${nft['token_id']}`,
                                        '_blank'
                                    )
                                    IS_LOCK.set(true)
                                    setTimeout(() => {
                                        IS_LOCK.set(false)
                                    }, 1000)
                                }
                            })
                        })
                    })
                }
            })
            .catch((err) => console.error(err))
    })
}
