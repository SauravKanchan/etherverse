<script>
  import kaboom from "kaboom"

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
  loadSpriteAtlas("player.png", "player.json")


  scene("game", () => {
    layers(["bg", "obj", "ui"], "obj")
  })

  const tile = {width: 12, height: 12}
  let map = []
  let row = ''
  for(let x=0; x < DIMENSION.x/(tile.width*SCALE); x++){
    row += ' '
  }
  console.log({row})
  for(let y=0; y <  DIMENSION.y/(tile.width*SCALE); y++){
    map.push(row)
  }
  console.log(map)

  const levelCfg = {
    width: tile.width,
    height: tile.height,
    ' ': () => [sprite('grass')],
  }
  
  const gameLevel = addLevel(map, levelCfg)

  const player = add([
    sprite("hero"),
    pos(DIMENSION.x/(SCALE*2), DIMENSION.y/(SCALE*2)),
    scale(0.5)
  ])

  player.play("idle-down")

  player.action(() => {
    const left = keyIsDown('left')
    const right = keyIsDown('right')
    const up = keyIsDown('up')
    const down = keyIsDown('down')
    const speed = 20/SCALE
    const currAnim = player.curAnim()
    // var currCam = camPos();
    camPos(player.pos.add(DIMENSION.x/(SCALE*2),DIMENSION.y/(SCALE*2)))
    // camPos(player.pos)
  

    if (left) {
        if(currAnim !== 'move-left') {
          player.play('move-left')
        }
        player.pos.x -= speed
    } else if (right) {
      if(currAnim !== 'move-right') {
          player.play('move-right')
      }
      player.pos.x += speed
    } else if (up) {
        if(currAnim !== 'move-up') {
          player.play('move-up')
        }
        player.pos.y -= speed
    } else if (down) {
      if(currAnim !== 'move-down') {
          player.play('move-down')
      }
      player.pos.y += speed
    }

  })
  
</script>