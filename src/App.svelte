<script>
  import "./kaboom";
  import { createBuilding, createCity } from "./city";
  import { createPlayer } from "./player";

  loadRoot("assets/");
  loadSprite("grass", "grass.png");
  loadSprite("bb", "building_bottom.png");
  loadSprite("mb", "building_middle.png");
  loadSprite("door", "door.png");
  loadSprite("window", "window.png");
  loadSpriteAtlas("player.png", "player.json");

  scene("game", () => {
    layers(["bg", "obj", "ui"], "obj");
  });

  let { map, levelCfg } = createCity();
  createBuilding(map);
  addLevel(map, levelCfg);

  createPlayer();

  // debug.inspect = true
</script>
