<script>
  import "./kaboom";
  import { createBuilding, createCity } from "./city";
  import { createPlayer } from "./player";
  import { hallScene } from "./home";
  import { DIMENSION, SCALE } from "./constant";
  import { changeRoom } from "./utils";

  let next_scene = {};

  loadRoot("assets/");
  loadSprite("grass", "grass.png");
  loadSprite("bb", "building_bottom.png");
  loadSprite("mb", "building_middle.png");
  loadSprite("door", "door.png");
  loadSprite("window", "window.png");
  loadSpriteAtlas("player.png", "player.json");
  loadSprite("brick", "brick.png");
  loadSprite("ht", "house_tile.png");
  loadSprite("bg", "grass.png");
  loadSprite("ethtile", "eth.png");
  loadSprite("gate", "gate.png");
  loadSprite("player", "player.png");
  loadSprite("stone-wall", "stone-wall.png");
  loadSprite("brown-floor", "brown-floor.png");
  loadSprite("cream-floor", "cream-floor.png");
  loadSprite("nft1", "arcane.jpeg");
  loadSprite("nft2", "nft2.png");
  loadSprite("entry", "entry_block.png");

  scene("game", ({ position }) => {
    layers(["bg", "obj", "ui"], "obj");
    let { map, levelCfg } = createCity();
    createBuilding(map);
    addLevel(map, levelCfg);

    const player = createPlayer({
      position,
      starting_animation: "idle-down",
    });
    

    changeRoom(player, "building_entry", "Press X to enter your room",() => {
      hallScene();
      go("hall", {});
    });
  });

  go("game", {
    position: {
      x: DIMENSION.x / (SCALE * 2) - 150,
      y: DIMENSION.y / (SCALE * 2) + 150,
    },
  });

  // debug.inspect = true;
</script>
