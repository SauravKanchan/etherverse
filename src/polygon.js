import { hallScene } from './home'
import { createBuilding, createCity } from './city'
import { DIMENSION, SCALE } from './constant'
import { createPlayer } from './player'
import { ENTRY_BLOCKS } from './store'
import { changeRoom } from './utils'
import { parseUnits } from 'ethers/lib/utils'
import { ethers } from 'ethers'

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
    
    loadSprite('uniswap', 'uniswap.jpeg')
    scene('polygon', ({ position }) => {
        layers(['bg', 'obj', 'ui'], 'obj')
        let { map, levelCfg } = createCity(true)
        createBuilding(map)

        add([
            layer('obj'),
            sprite('uniswap'),
            pos(800, 200),
            area(),
            scale(0.5),
            solid(),
            'uniswap',
        ])

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


        player.onCollide('uniswap', ()=> {
            async function swapAllEthToMatic(signer) {
                const abi = [
                  {
                    inputs: [
                      {
                        components: [
                          { internalType: "address", name: "tokenIn", type: "address" },
                          { internalType: "address", name: "tokenOut", type: "address" },
                          { internalType: "uint24", name: "fee", type: "uint24" },
                          { internalType: "address", name: "recipient", type: "address" },
                          { internalType: "uint256", name: "deadline", type: "uint256" },
                          { internalType: "uint256", name: "amountIn", type: "uint256" },
                          {
                            internalType: "uint256",
                            name: "amountOutMinimum",
                            type: "uint256",
                          },
                          {
                            internalType: "uint160",
                            name: "sqrtPriceLimitX96",
                            type: "uint160",
                          },
                        ],
                        internalType: "struct ISwapRouter.ExactInputSingleParams",
                        name: "params",
                        type: "tuple",
                      },
                    ],
                    name: "exactInputSingle",
                    outputs: [
                      { internalType: "uint256", name: "amountOut", type: "uint256" },
                    ],
                    stateMutability: "payable",
                    type: "function",
                  },
                ];
              
                const swapRouter = new ethers.Contract(
                  "0xE592427A0AEce92De3Edee1F18E0157C05861564",
                  abi,
                  signer
                );
              
                const weth = new ethers.Contract(
                  "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
                  [
                    "function balanceOf(address) view returns (uint256)",
                    "function approve(address, uint256) returns (bool)",
                    "function allowance(address, address) view returns (uint256)",
                  ],
                  signer
                );
              
                const signerAddress = await signer.getAddress();
              
                const wethBalance = await weth.balanceOf(signerAddress);
              
                const allowance = await weth.allowance(signerAddress, swapRouter.address);
              
                if (allowance.lt(wethBalance)) {
                  const tx = await weth.approve(
                    swapRouter.address,
                    ethers.constants.MaxUint256,
                    { gasPrice: parseUnits("150", "gwei") } // TODO improve this
                  );
                  await tx.wait();
                }
              
                await swapRouter.exactInputSingle(
                  {
                    tokenIn: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", // polygon weth
                    tokenOut: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", // polygon wmatic
                    fee: 500,
                    recipient: signerAddress,
                    deadline: Math.floor(Date.now() / 1000) + 100,
                    amountIn: wethBalance,
                    amountOutMinimum: 0,
                    sqrtPriceLimitX96: 0,
                  },
                  { gasPrice: parseUnits("150", "gwei") } // TODO improve this
                );
              }

              // @ts-ignore
              swapAllEthToMatic(window.signer)
        })
    })
}
