<script>
  import kaboom from "kaboom"
  import { setCharAt, setOnMap } from "./utils"
  

  const DIMENSION = {
    x: window.innerWidth,
    y: window.innerHeight
  }

  const SCALE = 2

  kaboom({
    global: true,
    scale: SCALE,
    debug: true,
    background: [0,0,0,1],
    width: DIMENSION.x,
    height: DIMENSION.y
  })

  loadRoot("assets/")
  loadSprite("grass","grass.png")
  loadSprite("bb", "building_bottom.png")
  loadSprite("mb", "building_middle.png")
  loadSprite("door", "door.png")
  loadSprite("window", "window.png")
  loadSpriteAtlas("player.png", "player.json")


  scene("game", () => {
    layers(["bg", "obj", "ui"], "obj")
  })

  const tile = {width: 16, height: 16}
  let map = []
  let row = ''
  for(let x=0; x < DIMENSION.x/(tile.width); x++){
    row += ' '
  }
  for(let y=0; y <  DIMENSION.y/(tile.width); y++){
    map.push(row)
  }

  // Making Building
  const BUILDING_START = {x: 10, y: 5}
  const BUILDING_DIMENSION = {width: 11, height: 10};
  for(let x=0; x< BUILDING_DIMENSION.width; x++){
    for(let y=0; y< BUILDING_DIMENSION.height; y++){
      map = setOnMap(map, BUILDING_START.x + x, BUILDING_START.y+y, "#")
    }
  }
  for(let x=0; x< BUILDING_DIMENSION.width; x++){
      map = setOnMap(map, BUILDING_START.x + x, BUILDING_START.y+BUILDING_DIMENSION.height, "-")
  }
  setOnMap(map, BUILDING_START.x+Math.floor(BUILDING_DIMENSION.width/2), BUILDING_START.y+BUILDING_DIMENSION.height, "!") 
  setOnMap(map, BUILDING_START.x+Math.floor(BUILDING_DIMENSION.width/2)-3, BUILDING_START.y+BUILDING_DIMENSION.height-2, "w") 
  setOnMap(map, BUILDING_START.x+Math.floor(BUILDING_DIMENSION.width/2)+3, BUILDING_START.y+BUILDING_DIMENSION.height-2, "w") 

  setOnMap(map, BUILDING_START.x+Math.floor(BUILDING_DIMENSION.width/2)-3, BUILDING_START.y+BUILDING_DIMENSION.height-4, "w") 
  setOnMap(map, BUILDING_START.x+Math.floor(BUILDING_DIMENSION.width/2)+3, BUILDING_START.y+BUILDING_DIMENSION.height-4, "w") 

  setOnMap(map, BUILDING_START.x+Math.floor(BUILDING_DIMENSION.width/2)-3, BUILDING_START.y+BUILDING_DIMENSION.height-6, "w") 
  setOnMap(map, BUILDING_START.x+Math.floor(BUILDING_DIMENSION.width/2)+3, BUILDING_START.y+BUILDING_DIMENSION.height-6, "w") 

  setOnMap(map, BUILDING_START.x+Math.floor(BUILDING_DIMENSION.width/2)-3, BUILDING_START.y+BUILDING_DIMENSION.height-8, "w") 
  setOnMap(map, BUILDING_START.x+Math.floor(BUILDING_DIMENSION.width/2)+3, BUILDING_START.y+BUILDING_DIMENSION.height-8, "w") 

  const levelCfg = {
    width: tile.width,
    height: tile.height,
    ' ': () => [sprite('grass'), scale(1.25),layer("bg") ],
    '#': () => [sprite('mb'), area(),solid(),"build2"],
    '-': () => [sprite('bb'), area(),solid()],
    '!': () => [sprite('door')],
    'w': () => [sprite('window')]
  }
  
  const gameLevel = addLevel(map, levelCfg)

  const player = add([
    sprite("hero"),
    pos(DIMENSION.x/(SCALE*2), DIMENSION.y/(SCALE*2)),
    scale(0.5),
    layer("obj"),
    area(),
    solid()
  ])

  player.play("idle-down")


  onCollide("player", "build2", ()=> {
    console.log("its colliding");
  })


  player.action(() => {
    const left = keyIsDown('left')
    const right = keyIsDown('right')
    const up = keyIsDown('up')
    const down = keyIsDown('down')
    const speed = 200
    
    const currAnim = player.curAnim()
    // var currCam = camPos();
      camPos(player.pos.add(DIMENSION.x/(SCALE*2),DIMENSION.y/(SCALE*2)))


    if (left) {
        if(currAnim !== 'move-left') {
          player.play('move-left')
        }
        player.move(-speed, 0)
    } else if (right) {
      if(currAnim !== 'move-right') {
          player.play('move-right')
      }
      player.move(speed, 0)
    } else if (up) {
        if(currAnim !== 'move-up') {
          player.play('move-up')
        }
        player.move(0,-speed)
    } else if (down) {
      if(currAnim !== 'move-down') {
          player.play('move-down')
      }
      player.move(0,speed)
    }

  })
  
  debug.inspect = true

</script>