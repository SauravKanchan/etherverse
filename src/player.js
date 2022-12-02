import { DIMENSION, SCALE } from "./constant";

export const createPlayer = () => {
    const player = add([
        sprite("hero"),
        pos(DIMENSION.x/(SCALE*2), DIMENSION.y/(SCALE*2)),
        scale(0.5),
        layer("obj"),
        area(),
        solid(),
        "player"
      ])
    
      player.play("idle-down")
    
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
}
