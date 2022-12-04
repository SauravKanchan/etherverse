import { makeMap } from './city'
import { DIMENSION } from './constant'
import { createPlayer } from './player'
import { setOnMap } from './utils'

import { fetchTokenDetails } from './integrations/covalent' 
import { ethers } from 'ethers'
export const assetScene = () => {
 
    loadRoot('assets/');
    // loadSprite('eth', 'eth.png') ; //done
    // loadSprite('matic', 'matic.png') ; //done
    // loadSprite('dai', 'dai.png') ; //done
   
    //@ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum)
   

    scene('assets', async ({ position, starting_animation }) => {

        const signer = await provider.getSigner();
        const chainId = (await provider.getNetwork()).chainId;
        // const chainId = 1;
        // const address = await signer.getAddress();
        const address = "0x30f6bB77f74e74d627771E7B757e984A1d6457f9";

        const {ETH, DAI, MATIC} = await fetchTokenDetails(address,chainId);

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

      map =    setOnMap(map, map[0].length / 2, map.length - 2, 'e')
      map =    setOnMap(map, map[0].length / 2 - 1, map.length - 2, 'e')
      map =    setOnMap(map, map[0].length / 2 + 1, map.length - 2, 'e')
      map =    setOnMap(map, map[0].length / 2, map.length - 1, 'g')

        //Set assets on map

        setOnMap(map, 4, 4, 'K') //eth
        setOnMap(map, 5, 4, 'd') //eth
        setOnMap(map, 10, 4, 'k') //eth text
        setOnMap(map, 4, 8, 'L') //dai
        setOnMap(map, 5, 8, 't') //dai text
        setOnMap(map, 10, 8, 'l') //dai text
        setOnMap(map, 4, 16, 'M') // matic
        setOnMap(map, 5, 16, 'o') // matic
        setOnMap(map, 10, 16, 'm') // matic text
        


        const levelCfg = {
            width: 16,
            height: 16,
            '*': () => [sprite('mb'), area(), solid()],
            ' ': () => [sprite('ht'), 'wall', scale(18 / 16)],
            g: () => [sprite('door'), area(), solid(), 'gate'],
            e: () => [sprite('entry'), area(), 'exit'],
            d : () => [text(`ETH`), area(), layer("ui"),scale(0.25)],
            t : () => [text(`DAI`), area(), layer("ui"),scale(0.25)],
            o : () => [text(`MATIC`), area(), layer("ui"),scale(0.25)],
            "K": () => [sprite('eth'), area(), 'eth'],
            "k": () => [text(`${ETH}`), area(), layer("ui"),scale(0.25), 'eth_bal'],
            "L": () => [sprite('dai'), area(),  'dai'],
            "l": () => [text(`${DAI}`), area(), layer("ui"),scale(0.25), 'dai_bal'],
            "M": () => [sprite('matic'), area(),  'matic'],
            "m": () => [text(`${MATIC}`), area(), layer("ui"),scale(0.25) ,'matic_bal'],
        }

        console.log('here')

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
