import { makeMap } from "./city"
import { DIMENSION } from "./constant"
import { createPlayer } from "./player"
import { setOnMap } from "./utils"

export const assetScene = () => {
 
    loadRoot('assets/');
    loadSprite('eth', 'eth.png') ; //done
    loadSprite('matic', 'matic.png') ; //done
    loadSprite('dai', 'dai.png') ; //done
   
    //@ts-ignore
    // const provider = new ethers.providers.Web3Provider(window.ethereum)


    scene('assets', async ({ position, starting_animation }) => {

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

        //Set assets on map

        setOnMap(map, 4, 4, 'K') //eth
        setOnMap(map, 8, 4, 'L') //dai
        setOnMap(map, 12, 4, 'M') // matic
     

        const levelCfg = {
            width: 16,
            height: 16,
            '*': () => [sprite('mb'), area(), solid()],
            ' ': () => [sprite('ht'), 'wall', scale(18 / 16)],
            g: () => [sprite('door'), area(), solid(), 'gate'],
            e: () => [sprite('entry'), area(), 'exit'],
            K: () => [sprite('eth'), area(), solid(), 'eth'],
            L: () => [sprite('dai'), area(), solid(), 'dai'],
            M: () => [sprite('matic'), area(), solid(), 'matic'],
        }

        console.log("here");

        addLevel(map, levelCfg)

        const player = createPlayer({
            position,
            starting_animation,
        })

        // player.onCollide("exit", () => {
        //     go("hall", { position })
        // })


        // changeRoom(player, 'exit', 'Press X to exit your room', () => {
        //     go('game', { position: entry_blocks.building })
        // })


    })



}