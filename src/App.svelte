<script>
  import "./kaboom";
  import { createBuilding, createCity } from "./city";
  import { createPlayer } from "./player";
  import { hallScene, nftsScene } from "./home";
  import { DIMENSION, SCALE } from "./constant";
  import { changeRoom } from "./utils";
  import { start_hydrating } from "svelte/internal";
  import { ENTRY_BLOCKS } from "./store";

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
    const entry_pos = get("building_entry")[1]
      .inspect()
      .pos.replaceAll(" ", "")
      .replaceAll("(", "")
      .replaceAll(")", "")
      .split(",");
    ENTRY_BLOCKS.set({
      building: {
        x: parseInt(entry_pos[0]),
        y: parseInt(entry_pos[1]),
      },
    });
    const player = createPlayer({
      position,
      starting_animation: "idle-down",
    });

    player.setScale(SCALE);

    changeRoom(player, "building_entry", "Press X to enter your room", () => {
      hallScene();
      go("hall", {});
    });
  });

  nftsScene();
  go("nfts", {});

  // go("game", {
  //   position: {
  //     x: DIMENSION.x / (SCALE * 2),
  //     y: DIMENSION.y / (SCALE * 2),
  //   },
  // });

  // debug.inspect = true;
</script>
