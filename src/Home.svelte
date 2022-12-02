<script>
  import kaboom from "kaboom";

  kaboom({
    global: true,
    debug: true,
    scale: 1,
    width: 900,
    height: 15 * 18,
    background: [255, 255, 255],
  });

  loadRoot("/assets/");
  loadSprite("brick", "brick.png");
  loadSprite("bg", "grass.png");
  loadSprite("ethtile", "eth.png");
  loadSprite("gate", "gate.png");
  loadSprite("player", "player.png");
  loadSprite("stone-wall", "stone-wall.png");
  loadSprite("brown-floor", "brown-floor.png");
  loadSprite("cream-floor", "cream-floor.png");
  loadSprite("nft1", "arcane.jpeg");
  loadSprite("nft2", "nft2.png");

  //~~~~ Scene 1 ~~~~
  scene("hall", ({ level, score }) => {
    layers(["bg", "game", "ui"], "game");

    //792, 144
    const maps = [
      [
        "**************************************************",
        "*                                                *",
        "*                                                *",
        "*                                                *",
        "*                                                *",
        "*                                                *",
        "*                                                *",
        "*                                                n",
        "*                                                n",
        "*                                                *",
        "*                                                *",
        "*                                                *",
        "*                                                *",
        "*                                                *",
        "********************gg****************************",
      ],
    ];

    const levelCfg = {
      width: 18,
      height: 18,
      "*": () => [sprite("brick"), area(), solid()],
      " ": () => [sprite("bg"), area(), "wall"],
      g: () => [sprite("gate"), area(), solid(), scale(1), "gate"],
      n: () => [sprite("gate"), area(), solid(), scale(1), "nft"],
    };

    addLevel(maps[0], levelCfg);

    const player = add([
      sprite("player"),
      area(),
      solid(),
      pos(200, 55),
      scale(1.5),
      {
        dir: vec2(1, 0),
      },
      "player",
    ]);

    const SPEED = 300;

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

    //   const nft_room_txt = add([
    //     text("NFT Room"),

    //     pos(792, 144),
    //    { value: 0 },
    // ])
    const nft_room = add([
      text("NFT Room >"),
      scale(0.5),
      pos(600, 120),
      layer("game"),
      { value: 0 },
    ]);

    // add([sprite('bg'), layer('bg'), scale(2)])
    onCollide("player", "nft", () => {
      go("nfts", { level: 1, score: 10 });
    });
  });

  //~~~~ Scene 2 ~~~~~
  scene("nfts", ({ level, score }) => {
    layers(["bg", "game", "ui"], "game");

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
  go("hall", { level: 0, score: 0 });
  
</script>

<main />
