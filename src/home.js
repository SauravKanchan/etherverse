import { makeMap } from "./city";
import { DIMENSION, SCALE } from "./constant";
import { createPlayer } from "./player";
import { changeRoom, setOnMap } from "./utils";

export const hallScene = () => {
  scene("hall", ({ level, score }) => {
    layers(["bg", "obj", "ui"], "obj");

    let map = makeMap({x: DIMENSION.x/2, y: DIMENSION.y/2})

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

    const levelCfg = {
      width: 16,
      height: 16,
      "*": () => [sprite("mb"), area(), solid() ],
      " ": () => [sprite("ht"), "wall", scale(18/16)],
      'g': () => [sprite("door"), area(), solid(), "gate"],
      'n': () => [sprite("door"), area(), solid(),  "nft" ],
      'e': () => [sprite('entry'), area(), 'exit']
    };

    addLevel(map, levelCfg);

    const player = createPlayer({
      position: {x: DIMENSION.x/4+8,y: DIMENSION.y/2-32},
      starting_animation:"idle-up"
    })
    
    const nft_room = add([
      text("NFT Room >"),
      scale(0.5),
      pos(600, 120),
      layer("game"),
      { value: 0 },
    ]);

    // player.onCollide("nft", () => {
    //   go("nfts", {});
    // });

    changeRoom(player, 'exit', 'Press X to exit your room', ()=>{
      go("game", {position: {x: DIMENSION.x/(SCALE*2)-150, y: DIMENSION.y/(SCALE*2)+150}})
    })
  });
}

export const nftsScene = () => {
  scene("nfts", ({ }) => {
    layers(["bg", "obj", "ui"], "obj");


    const maps = [
      [
        "************************************************",
        "*                                              *",
        "*                                              *",
        "*                                              *",
        "*      1     2     2                           *",
        "g                                              *",
        "g                                              *",
        "*                                              *",
        "*                                              *",
        "*                                              *",
        "*                                              *",
        "*                                              *",
        "*                                              *",
        "*                                              *",
        "************************************************",
      ],
    ];

    const levelCfg = {
      width: 16,
      height: 16,
      "*": () => [sprite("stone-wall"), area(), solid()],
      " ": () => [sprite("cream-floor"), area(), "wall"],
      "1": () => [sprite("nft1"), area(), scale(0.5), z(1), "nft1"],
      "2": () => [sprite("nft2"), area(), scale(3), z(1)],
      g: () => [sprite("gate"), area(), solid(), scale(1), "gate"],
    };

    addLevel(maps[0], levelCfg);

    const player = add([
      sprite("player"),
      area(),
      solid(),
      pos(32, 80),
      scale(1.5),
      {
        dir: vec2(1, 0),
      },
      "player",
    ]);

    const SPEED = 500;

    onKeyDown("right", () => {
      player.move(SPEED, 0);
      // player.flipX(true);
    });

    onKeyDown("left", () => {
      player.move(-SPEED, 0);
      player.dir = vec2(-1, 0);
      // player.flipX(true);
    });

    onKeyDown("up", () => {
      player.move(0, -SPEED);
      player.dir = vec2(0, 1);
    });

    onKeyDown("down", () => {
      player.move(0, SPEED);
      player.dir = vec2(0, 1);
    });

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
