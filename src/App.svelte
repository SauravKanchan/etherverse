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

</script>