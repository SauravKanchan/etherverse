import { makeMap } from "./city"
import { DIMENSION } from "./constant"
import { createPlayer } from "./player"
import { changeRoom, setOnMap } from "./utils"
import { fetchEnsDetails } from "./integrations/ens/"
import { ethers } from "ethers"

export const ensScene = () => {
    //Load Sprites
    //     twitter.png
    // github.png
    // discord.png
    loadRoot('assets/')

    loadSprite('twitter', 'twitter.png')//done
    loadSprite('ens', 'ens.png')//done
    loadSprite('github', 'github.png')//done
    loadSprite('discord', 'discord.png')//done
    loadSprite('telegram', 'telegram.png') //done
    loadSprite('linkedin', 'linkedin.png') //done
    loadSprite('website', 'website.png') //done
    loadSprite('email', 'email.png')//done

    //@ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    // const address = "0x5555763613a12d8f3e73be831dff8598089d3dca";


    //check the ens properties which are available

    scene('ensOffice', async ({ position, starting_animation }) => {

        const address = await (await provider.getSigner()).getAddress();
        let ensDetails = await fetchEnsDetails(address);

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

        setOnMap(map, 2, 4, 'q') //ens
        setOnMap(map, 6, 4, 'd') //
        setOnMap(map, 10, 4, 't') // 
        setOnMap(map, 14, 4, 'v') // 
        setOnMap(map, 2, 12, 'w') //
        setOnMap(map, 6, 12, 'r') //
        setOnMap(map, 10, 12, 'h') //
        setOnMap(map, 14, 12, 'l') //

        const levelCfg = {
            width: 16,
            height: 16,
            '*': () => [sprite('mb'), area(), solid()],
            ' ': () => [sprite('ht'), 'wall', scale(18 / 16)],
            g: () => [sprite('door'), area(), solid(), 'gate'],
            e: () => [sprite('entry'), area(), 'exit'],
            q: () => [sprite('ens'), area(), solid(), 'ens'],
            t: () => [sprite('telegram'), area(), solid(), 'telegram'],
            v: () => [sprite('email'), area(), solid(), 'email'],
            w: () => [sprite('website'), area(), solid(), 'website'],
            d: () => [sprite('discord'), area(), solid(), 'discord'],
            r: () => [sprite('twitter'), area(), solid(), 'twitter'],
            h: () => [sprite('github'), area(), solid(), 'github'],
            l: () => [sprite('linkedin'), area(), solid(), 'linkedin'],

        }

        addLevel(map, levelCfg)

        const player = createPlayer({
            position,
            starting_animation,
        })

        const entries = {
            "twitter": {
                ensName: "com.twitter",
            },
            "linkedin": {
                ensName: "com.linkedin",
            },
            "discord": {
                ensName: "com.discord",
            },
            "website": {
                ensName: "url",
            },
            "email": {
                ensName: "email",
            },
            "telegram": {
                ensName: "org.telegram",
            },
            "github": {
                ensName: "com.github",
            },
        }


        let ENS_TXT;


        if (ensDetails) {
            player.onCollide("ens", () => {
                destroy(ENS_TXT);

                ENS_TXT = add([
                    text(`${ensDetails.ensName}`),
                    scale(0.5),
                    layer("ui"),
                    pos(player.pos.x, player.pos.y),
                    lifespan(5, { fade: 2 }),
                ]);
            })

            if (ensDetails.ensName) {
                for (let x of Object.keys(entries)) {
                    player.onCollide(x, () => {
                        destroy(ENS_TXT);

                        ENS_TXT = add([
                            text(`${ensDetails.details[entries[x].ensName] ? ensDetails.details[entries[x].ensName] : "-Not Found-"}`),
                            scale(0.5),
                            layer("ui"),
                            pos(player.pos.x, player.pos.y),
                            lifespan(5, { fade: 2 }),
                        ]);
                    })


                }
            }
        }else{
            ENS_TXT = add([
                text("ENS Details Not Found"),
                scale(0.5),
                layer("ui"),
                pos(DIMENSION.x/8, DIMENSION.y/8),
               
            ]);
        }


        changeRoom(player, 'exit', 'Press X exit to hall', ()=>{
            // ensScene();
            go("hall", { position: {x:  map[0].length / 2 - 1, y: map.length - 2 }  })
        })


        // const nft = add([
        //     text('NFT Room >'),
        //     scale(0.3),
        //     pos(DIMENSION.x / 2 - 175, NFT_ROOM_TEXT_HEIGHT),
        //     { value: 0 },
        // ])

        // changeRoom(player, 'exit', 'Press X to exit your room', () => {
        //     go('game', { position: entry_blocks.building })
        // })


    })



}