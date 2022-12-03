import { DIMENSION } from './constant'

const scene_scale = () => {
    let sl = 1
    return {
        setScale(scale) {
            sl = scale
        },
        getScale() {
            return sl
        },
    }
}

export const createPlayer = ({ position, starting_animation }) => {
    if (!starting_animation) starting_animation = 'idle-down'
    const player = add([
        sprite('hero'),
        layer('obj'),
        pos(position.x, position.y),
        scale(0.5),
        area(),
        solid(),
        'player',
        scene_scale(),
    ])

    player.play(starting_animation)

    action(() => {
        const left = keyIsDown('left')
        const right = keyIsDown('right')
        const up = keyIsDown('up')
        const down = keyIsDown('down')
        const speed = 200
        let scene_scale = player.getScale()

        const currAnim = player.curAnim()
        let currCam = camPos()
        if (player.pos.x > DIMENSION.x / (scene_scale * 2)) {
            camPos(
                vec2(player.pos.x + DIMENSION.x / (scene_scale * 2), currCam.y)
            )
        }
        if (
            player.pos.y > DIMENSION.y / (scene_scale * 2) &&
            player.pos.y < DIMENSION.y - DIMENSION.y / (scene_scale * 2)
        ) {
            camPos(
                vec2(currCam.x, player.pos.y + DIMENSION.y / (scene_scale * 2))
            )
        }

        if (left) {
            if (currAnim !== 'move-left') {
                player.play('move-left')
            }
            player.move(-speed, 0)
        } else if (right) {
            if (currAnim !== 'move-right') {
                player.play('move-right')
            }
            player.move(speed, 0)
        } else if (up) {
            if (currAnim !== 'move-up') {
                player.play('move-up')
            }
            player.move(0, -speed)
        } else if (down) {
            if (currAnim !== 'move-down') {
                player.play('move-down')
            }
            player.move(0, speed)
        }
    })
    return player
}
