<script>
  import kaboom from "kaboom"

  kaboom({
    global: true,
    scale: 2,
    debug: true,
    background: [0,0,0,1],
  })

  loadRoot("assets/")
  loadSprite("grass","grass.png")
  loadSpriteAtlas("player.png", "player.json")


  scene("game", () => {
    layers(["bg", "obj", "ui"], "obj")
  })


  const map = [
    '                                                                     ',
    '                                                                     ',
    '                                                                     ',
    '                                                                     ',
    '                                                                     ',
    '                                                                     ',
    '                                                                     ',
    '                                                                     ',
    '                                                                     ',
    '                                                                     ',
    '                                                                     ',
    '                                                                     ',
    '                                                                     ',
    '                                                                     ',
    '                                                                     ',
    '                                                                     ',
    '                                                                     ',
    '                                                                     ',
    '                                                                     ',
    '                                                                     ',
    '                                                                     ',
    '                                                                     ',
    '                                                                     ',
    '                                                                     ',
    '                                                                     ',
    '                                                                     ',
    '                                                                     ',
    '                                                                     ',
    '                                                                     ',
    '                                                                     ',
    '                                                                     ',
    '                                                                     ',
    '                                                                     ',
    '                                                                     ',
    '                                                                     ',
  ]

  const levelCfg = {
    width: 12,
    height: 12,
    ' ': () => [sprite('grass')],
  }
  
  const gameLevel = addLevel(map, levelCfg)

  const player = add([
    sprite("hero"),
    pos(100,100)
  ])

  let i = 0;
  player.play("idle-down")

  player.action(() => {
    const left = keyIsDown('left')
    const right = keyIsDown('right')
    const up = keyIsDown('up')
    const down = keyIsDown('down')
    const speed = 10
    const currAnim = player.curAnim()
    var currCam = camPos();
    camPos(player.pos);
  

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