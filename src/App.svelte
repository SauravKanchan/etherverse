<script>
    import './kaboom'
    import { createBuilding, createCity } from './city'
    import { hallScene, nftsScene } from './home'
    import { DIMENSION, SCALE, TILE } from './constant'
    import { changeRoom } from './utils'
    import { BRIDGE_DURATION, ENTRY_BLOCKS, SHOW_NOTIFICATION } from './store'
    import Modal from './Modal.svelte'
    import { makeMap } from './city'
    import { createPlayer } from './player'
    import { setOnMap } from './utils'
    import { bridgeToOtherNetwork } from './integrations/lifi'
    import { ethers } from 'ethers'
    import { getNotifications } from './integrations/push'
    
    import { loadPolygon } from './polygon'

    let truck_obj
    let bridge_duration
    let water_pos = {
        start: 5,
        end: 15,
    }
    let time = 0
    let showNotifications,
        showBridge,
        selected,
        amount,
        tokens = ['ETH', 'DAI', 'MATIC']
    BRIDGE_DURATION.subscribe((d) => {
        bridge_duration = d
        // bridge_duration = 10
        showBridge = false
        console.log(DIMENSION.x * 0.3125)
        let interval = setInterval(() => {
            truck_obj.pos.x =
                DIMENSION.x / 4 -
                300 +
                (time / bridge_duration) * (DIMENSION.x * 0.3725)
            time += 0.1
            console.log(truck_obj.pos.x, time)
        }, 100)
        setTimeout(() => {
            clearInterval(interval)
        }, bridge_duration * 1000)
    })

    // @ts-ignore
    const windowEthereum = window.ethereum
    let provider, signer
    async function main() {
        if (typeof windowEthereum !== 'undefined') {
            provider = new ethers.providers.Web3Provider(windowEthereum)
            await provider.send('eth_requestAccounts', [])
            signer = await provider.getSigner()
            // @ts-ignore
            window.signer = signer
            // @ts-ignore
            window.provider = provider
        }
    }

    main().catch((e) => {
        console.log(e)
    })

    const handleBridgeTransfer = async () => {
        // console.log("handler bridge");
        await bridgeToOtherNetwork({
            amount,
            tokenName: selected,
            signer,
            network: 'polygon',
        })
        time = 0
        // alert(`answered question ${selected.id} (${selected.text}) with "${answer}"`);
    }

    const loadBridge = () => {
        loadRoot('assets/')
        loadSprite('fence-left', 'fence_left.png')
        loadSprite('fence-right', 'fence_right.png')
        loadSprite('fence-middle', 'fence_middle.png')
        loadSprite('bridge', 'bridge.png')
        loadSprite('bridge_floor', 'bridge_floor.png')
        loadSprite('truck', 'truck.png')
        loadSprite('road', 'road.png')
        loadSprite('bridgeNS', 'bridgeNS.png')
        loadSprite('counter', 'entry_block.png')
        loadSprite('water', 'water2.png')
        loadSprite('water_m', 'water_m.png')
        loadSprite('mailbox', 'mailbox.png')

        scene('bridge', ({ position, starting_animation }) => {
            layers(['bg', 'obj', 'ui'], 'obj')
            if (!starting_animation) starting_animation = 'idle-right'

            let map = makeMap({
                x: DIMENSION.x / 2 - 4,
                y: DIMENSION.y / 2 - 16,
            })

            // border
            // for (let i = 0; i < DIMENSION.y; i++) {
            //     map = setOnMap(map, 0, i, '*')
            //     map = setOnMap(map, map[0].length - 1, i, '*')
            // }
            for (let i = 0; i < DIMENSION.x; i++) {
                map = setOnMap(map, i, 0, '*')
                map = setOnMap(map, i, map.length - 1, '*')
            }

            // water
            water_pos = { ...water_pos, end: map[0].length - 5 }
            for (let x = 0; x < map[0].length; x++) {
                for (let y = 0; y < map.length; y++) {
                    if (x < water_pos.start || x > water_pos.end) {
                        if (
                            x > water_pos.end &&
                            !(y < 1 || y > map.length - 2)
                        ) {
                            map = setOnMap(map, x, y, 'p')
                        }
                        continue
                    }
                    if (y < 1 || y > map.length - 2) continue
                    map = setOnMap(map, x, y, 'e')
                }
            }

            // bridge
            for (let x = 0; x < DIMENSION.y; x++) {
                if (x < water_pos.start || x > water_pos.end) continue
                map = setOnMap(map, x, 8, 'm')
            }

            for (let x = 0; x < DIMENSION.y; x++) {
                if (x < water_pos.start || x > water_pos.end) continue
                map = setOnMap(map, x, 9, 'b')
                map = setOnMap(map, x, 10, 'b')
                map = setOnMap(map, x, 11, 'b')
                map = setOnMap(map, x, 12, 'b')
            }

            // map = setOnMap(map, water_pos.start, 10, 't')

            for (let x = 0; x < DIMENSION.y; x++) {
                if (x < water_pos.start || x > water_pos.end) continue
                map = setOnMap(map, x, 13, 'm')
            }

            for (let x = 0; x < DIMENSION.y; x++) {
                if (x < water_pos.start || x > water_pos.end) continue
                map = setOnMap(map, x, 14, 'f')
                map = setOnMap(map, x, 15, 'f')
            }

            for (let x = 0; x < DIMENSION.y; x++) {
                if (x < water_pos.start || x > water_pos.end) continue
                map = setOnMap(map, x, 16, 'm')
            }

            const counter = {
                x: 0,
                y: 1,
                width: 5,
                height: 5,
            }

            for (let x = counter.x; x < counter.width; x++) {
                for (let y = counter.y; y < counter.height; y++) {
                    map = setOnMap(map, x, y, 'c')
                }
            }

            const counter_polygon = {
                x: map[0].length - 1,
                y: 1,
                width: 3,
                height: 5,
            }
            console.log(counter_polygon.x, counter_polygon.width)
            for (let x = 0; x <= counter_polygon.width; x++) {
                for (let y = counter_polygon.y; y < counter_polygon.height; y++) {
                    map = setOnMap(map, counter_polygon.x - x, y, 'C')
                }
            }


            add([
                text('LIFI\nMovers\nETH'),
                pos(15, 30),
                scale(0.2),
                layer('ui'),
            ])

            add([
                text('LIFI\nMovers\nPolygon'),
                pos(DIMENSION.x/2-65, 30),
                scale(0.2),
                layer('ui'),
            ])


            const levelCfg = {
                width: TILE.width,
                height: TILE.height,
                '*': () => [sprite('mb'), area(), solid(), scale(1.125)],
                ' ': () => [sprite('bg'), area(), 'wall', scale(1.125)],
                p: () => [
                    sprite('polygon_grass'),
                    area(),
                    'wall',
                    scale(1.125),
                ],
                w: () => [sprite('water'), area(), solid(), scale(1.125)],
                n: () => [sprite('gate'), area(), 'wall', scale(1.125)],
                g: () => [
                    sprite('gate'),
                    area(),
                    solid(),
                    scale(1.125),
                    'gate',
                ],
                l: () => [sprite('fence-left'), area(), solid(), scale(1.125)],
                r: () => [sprite('fence-right'), area(), solid(), scale(1.125)],
                m: () => [
                    sprite('fence-middle'),
                    area(),
                    solid(),
                    scale(1.125),
                ],
                f: () => [sprite('bridgeNS'), area(), scale(1), scale(1.125)],
                e: () => [sprite('water_m'), area(), solid(), scale(1.125)],
                h: () => [sprite('mailbox'), area(), solid(), 'mailbox'],
                b: () => [sprite('road'), area(), solid(), scale(1.125)],
                c: () => [
                    sprite('counter'),
                    area(),
                    solid(),
                    scale(1),
                    'counter',
                ],
                C: () => [
                    sprite('counter'),
                    area(),
                    solid(),
                    scale(1),
                    'counter-polygon',
                ],
            }

            addLevel(map, levelCfg)
            truck_obj = add([
                sprite('truck'),
                layer('obj'),
                pos(DIMENSION.x / 4 - 300, DIMENSION.y / 4 - 50),
                scale(1.125),
                area(),
                solid(),
                'player',
            ])

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
                    showBridge = true
                })

                wait(3, () => {
                    bridgeCounter()
                })
            })

            let one_time = action(() => {
                if (player.pos.x <= 0) {
                    go('game', {
                        position: { x: DIMENSION.x - 10, y: player.pos.y },
                    })
                    one_time()
                }
                if (player.pos.x >= DIMENSION.x / 2) {
                    loadPolygon()
                    go('polygon', {
                        position: { x: 10, y: player.pos.y },
                    })
                    one_time()
                }
            })
        })
    }

    loadRoot('assets/')
    loadSprite('grass', 'grass.png')
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

    loadSprite('eth', 'eth.png') //done
    loadSprite('matic', 'matic.png') //done
    loadSprite('dai', 'dai.png') //done

    loadSprite('mailbox', 'mailbox.png') ; //done

    scene('game', ({ position }) => {
        layers(['bg', 'obj', 'ui'], 'obj')
        let { map, levelCfg } = createCity()
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
                go('hall', {})
            }
        )
        let one_time = action(() => {
            if (player.pos.x >= DIMENSION.x) {
                go('bridge', { position: { x: 0, y: player.pos.y } })
                one_time()
            }
        })

        if (DIMENSION.x - player.pos.x < 100) {
            camPos(vec2(player.pos.x, player.pos.y + DIMENSION.y / (SCALE * 2)))
        } else {
            camPos(
                vec2(
                    player.pos.x + DIMENSION.x / (SCALE * 2),
                    player.pos.y + DIMENSION.y / (SCALE * 2)
                )
            )
        }
    })

    let player_poistion = {
        x: DIMENSION.x / (SCALE * 2),
        y: DIMENSION.y / (SCALE * 2),
    }

    loadBridge()
    go('bridge', { position: player_poistion })

    // hallScene()
    // go('hall', {})

    // go('game', {
    //     position: player_poistion,
    // })
    // loadPolygon()
    // go('polygon', { position: player_poistion })

    let Notificationitems;

    SHOW_NOTIFICATION.subscribe( async (value) => {
        Notificationitems = [];
        if(value){
            showNotifications = true;
             Notificationitems = (await getNotifications( window.signer )).feeds;
        }else{
            showNotifications = false;
        }
    } )

    // debug.inspect= true
</script>

{#if showBridge}
    <Modal>
        <div
            class="mt-7 bg-white  rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700"
        >
            <div class="p-4 sm:p-7">
                <div class="text-center">
                    <h1
                        class="block text-2xl font-bold text-gray-800 dark:text-white"
                    >
                        Transfer Asset to Polygon
                    </h1>
                </div>

                <div class="mt-5">
                    <!-- <form> -->
                    <div class="grid gap-y-4">
                        <div>
                            <label
                                for="token"
                                class="block text-sm font-bold ml-1 mb-2 dark:text-white"
                                >Token</label
                            >
                            <div class="relative">
                                <select
                                    class="form-select appearance-none
                  block
                  w-full
                  px-3
                  py-1.5
                  text-base
                  font-normal
                  text-gray-700
                  bg-white bg-clip-padding bg-no-repeat
                  border border-solid border-gray-300
                  rounded
                  transition
                  ease-in-out
                  m-0
                  focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                    bind:value={selected}
                                    on:change={() => (amount = 0)}
                                >
                                    {#each tokens as question}
                                        <option value={question}>
                                            {question}
                                        </option>
                                    {/each}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label
                                for="email"
                                class="block text-sm font-bold ml-1 mb-2 dark:text-white"
                                >Amount</label
                            >
                            <div class="relative">
                                <input
                                    bind:value={amount}
                                    id="amount"
                                    name="amount"
                                    class="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                                    required
                                    aria-describedby="email-error"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                on:click={() => (showBridge = false)}
                                class="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                                >Cancel</button
                            >
                            <button
                                on:click={handleBridgeTransfer}
                                class="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                                >Transfer</button
                            >
                        </div>
                    </div>
                    <!-- </form> -->
                </div>
            </div>
        </div>
    </Modal>
{/if}


{#if showNotifications}
<Modal on:close={() => (showNotifications = false)}>
    <div
      class="mt-7 bg-white  rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700"
    >
      <div class="p-4 sm:p-7">
        <div class="text-center">
          <h1 class="block text-2xl font-bold text-gray-800 dark:text-white">
            Notifications 
          </h1>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
           
          <a class="text-blue-600 decoration-2 hover:underline font-medium" target="_blank" href="https://push.org/">
            Powered by Push Protocol
          </a>
        </p>
        </div>

        <div class="mt-5">
            <div class="grid gap-y-4">
              <div class='container'>
                <ul>
                  {#each Notificationitems as item}
                    <li>
                          <h1>{item.payload.notification.title}</h1>
                          <span>{item.payload.notification.body}</span>
                    </li>
                  {/each}
                </ul>
              </div>

              
                <button
                  on:click={() => { SHOW_NOTIFICATION.set(false) } }
                  class="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                  >Cancel</button>
              
              </div>
            </div>
          <!-- </form> -->
        </div>
    </div>
  
  </Modal>

{/if}