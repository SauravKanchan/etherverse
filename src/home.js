import { makeMap } from "./city";
import { DIMENSION, SCALE } from "./constant";
import { createPlayer } from "./player";
import { ENTRY_BLOCKS } from "./store";
import { changeRoom, setOnMap } from "./utils";
let entry_blocks;
ENTRY_BLOCKS.subscribe((d)=> {
  entry_blocks = d
})

const NFT_ROOM_DOOR_ROW = 8
export const hallScene = () => {
  scene("hall", ({ level, score }) => {
    layers(["bg", "obj", "ui"], "obj");

    let map = makeMap({x: DIMENSION.x/2-4, y: DIMENSION.y/2-16})

    // border
    for(let i=0; i < DIMENSION.y; i ++) {
      map = setOnMap(map, 0,i, "*")
      map = setOnMap(map, map[0].length-1,i, "*")
    }
    for(let i=0; i < DIMENSION.x; i ++) {
      map = setOnMap(map, i,0, "*")
      map = setOnMap(map, i,map.length-1, "*")
    }

    setOnMap(map, map[0].length/2, map.length-2, 'e')
    setOnMap(map, map[0].length/2-1, map.length-2, 'e')
    setOnMap(map, map[0].length/2+1, map.length-2, 'e')
    setOnMap(map, map[0].length/2, map.length-1, 'g')


    setOnMap(map, map[0].length-1, NFT_ROOM_DOOR_ROW, 'n')
    setOnMap(map, map[0].length-2, NFT_ROOM_DOOR_ROW-1, 'N')
    setOnMap(map, map[0].length-2, NFT_ROOM_DOOR_ROW, 'N')
    setOnMap(map, map[0].length-2, NFT_ROOM_DOOR_ROW+1, 'N')

    const levelCfg = {
      width: 16,
      height: 16,
      "*": () => [sprite("mb"), area(), solid() ],
      " ": () => [sprite("ht"), "wall", scale(18/16)],
      'g': () => [sprite("door"), area(), solid(), "gate"],
      'n': () => [sprite("door"), area(), solid()],
      'N': () => [sprite("entry"), area(), "nfts-entry"],
      'e': () => [sprite('entry'), area(), 'exit']
    };

    addLevel(map, levelCfg);

    const player = createPlayer({
      position: {x: DIMENSION.x/4-8,y: DIMENSION.y/2-36},
      starting_animation:"idle-up"
    })
    
    const nft = add([
      text("NFT Room >"),
      scale(0.3),
      pos(DIMENSION.x/2-175, 125),
      { value: 0 },
    ]);

    changeRoom(player, 'exit', 'Press X to exit your room', ()=>{
      go("game", {position: entry_blocks.building})
    })


    changeRoom(player, 'nfts-entry', 'Press X to NFT room', ()=>{
      nftsScene()
      go("nfts", {position: entry_blocks.building})
    }, {
      x: -150,
      y: 15
    })

  });
}

export const nftsScene = () => {
  scene("nfts", ({ }) => {
    layers(["bg", "obj", "ui"], "obj");


    let map = makeMap({x: DIMENSION.x/2-4, y: DIMENSION.y/2-16})
        
    // border
    for(let i=0; i < DIMENSION.y; i ++) {
      map = setOnMap(map, 0,i, "*")
      map = setOnMap(map, map[0].length-1,i, "*")
    }
    for(let i=0; i < DIMENSION.x; i ++) {
      map = setOnMap(map, i,0, "*")
      map = setOnMap(map, i,map.length-1, "*")
    }

    setOnMap(map, 0, NFT_ROOM_DOOR_ROW, 'n')

    const levelCfg = {
      width: 16,
      height: 16,
      "*": () => [sprite("stone-wall"), area(), solid()],
      " ": () => [sprite("cream-floor"), area(), "wall"],
      "1": () => [sprite("nft1"), area(), scale(0.5), z(1), "nft1"],
      "2": () => [sprite("nft2"), area(), scale(3), z(1)],
      "n": () => [sprite("door"), area(), solid(), scale(1), "gate"],
    };

    addLevel(map, levelCfg);

    const player = createPlayer({
      position: {x: DIMENSION.x/4-8,y: DIMENSION.y/2-36},
      starting_animation:"idle-up"
    })
 
    // add([sprite('bg'), layer('bg'), scale(2)])
    onCollide("player", "gate", () => {
      go("hall", { level: 0, score: 0 });
    });

    //on player colliding

    onCollide("player", "nft1", () => {

      add([
        text("Press X to open Nft"),
        scale(0.5),
        layer("ui"),
        pos(player.pos.x, player.pos.y),
        lifespan(3, { fade: 2 }),
      ]);

    });
  });
}
