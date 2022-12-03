import { DIMENSION, SCALE } from "./constant";

export const createPlayer = ({position,starting_animation}) => {
    if(!starting_animation)starting_animation="idle-down"
    const player = add([
        sprite("hero"),
        // pos(DIMENSION.x/(SCALE*2), DIMENSION.y/(SCALE*2)),
        pos(position.x, position.y),
        scale(0.5),
        area(),
        solid(),
        "player"
      ])
    
      player.play(starting_animation)
    
      action(() => {
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
      return player
}
