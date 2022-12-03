let showNotifications

export const loadBridge = () => {
    loadRoot('assets/')
    loadSprite('fence-left', 'fence_left.png')
    loadSprite('fence-right', 'fence_right.png')
    loadSprite('fence-middle', 'fence_middle.png')
    loadSprite('bridge', 'bridge.png')
    loadSprite('bridge_floor', 'bridge_floor.png')
    loadSprite('truck', 'truck.png')
    loadSprite('road', 'road.png')
    loadSprite('bridgeNS', 'bridgeNS.png')
    loadSprite('counter', 'counter.png')
    loadSprite('water', 'water2.png')
    loadSprite('water_m', 'water_m.png')
    loadSprite('mailbox', 'mailbox.png')

    scene('bridge', () => {
        layers(['bg', 'obj', 'ui'], 'obj')

        //792, 144
        const maps = [
            [
                '**************************************************',
                '*    eeeeeeeeweeeeeeeweeeee                      *',
                '*    eeeweeeeeeeeeeeeeeeeee                      *',
                '*    eeeeeeeeweeeeeeeeeeeew        h              *',
                '*    rmmmmmmmmmmmmmmmmmmmml                      *',
                '*    bbbbbbbbbbbbbbbbbbbbbb                      *',
                '*    btbbbbbbbbbbbbbbbbbbbb                      *',
                '*    bbbbbbbbbbbbbbbbbbbbbb                      *',
                '*   crmmmmmmmmmmmmmmmmmmmml                      *',
                '*    wwwwwwwwwwwwwwwwwwwwww                      *',
                '*    rmmmmmmmmmmmmmmmmmmmml                      n',
                '*    ffffffffffffffffffffff                      *',
                '*    ffffffffffffffffffffff                      *',
                '*    ffffffffffffffffffffff                      *',
                '*    rmmmmmmmmmmmmmmmmmmmml                      *',
                '*    wwwwwwwwwwwwwwwwwwwwww                      *',
                '*    eeeeeeeeweeeeeeeeeeeee                      *',
                '*    wweewwwwwwwwwweewwwwww                      *',
                '********************gg****************************',
            ],
        ]

        const levelCfg = {
            width: 18,
            height: 18,
            '*': () => [sprite('brick'), area(), solid()],
            ' ': () => [sprite('bg'), area(), 'wall'],
            w: () => [sprite('water'), area(), solid()],
            n: () => [sprite('gate'), area(), 'wall'],
            g: () => [sprite('gate'), area(), solid(), scale(1), 'gate'],
            l: () => [sprite('fence-left'), area(), solid()],
            r: () => [sprite('fence-right'), area(), solid()],
            m: () => [sprite('fence-middle'), area(), solid()],
            f: () => [sprite('bridgeNS'), area(), scale(1)],
            e: () => [sprite('water_m'), area(), solid()],
            h: () => [sprite('mailbox'), area(), solid(), 'mailbox'],
            b: () => [sprite('road'), area(), solid()],
            c: () => [sprite('counter'), area(), solid(), scale(1), 'counter'],
            t: () => [sprite('truck'), area(), solid(), layer('ui')],
        }

        addLevel(maps[0], levelCfg)

        const player = add([
            sprite('player'),
            area(),
            solid(),
            pos(200, 180),
            scale(1.5),
            {
                dir: vec2(1, 0),
            },
            'player',
        ])

        const SPEED = 300

        onKeyDown('right', () => {
            player.move(SPEED, 0)
            // player.flipX(true);
        })

        onKeyDown('left', () => {
            player.move(-SPEED, 0)
            player.dir = vec2(-1, 0)
            // player.flipX(true);
        })

        onKeyDown('up', () => {
            player.move(0, -SPEED)
            player.dir = vec2(0, 1)
        })

        onKeyDown('down', () => {
            player.move(0, SPEED)
            player.dir = vec2(0, 1)
        })

        let bridge_text

        player.onCollide('counter', () => {
            destroy(bridge_text)

            bridge_text = add([
                text('Press b to Bridge tokens'),
                scale(0.5),
                layer('ui'),
                pos(player.pos.x, player.pos.y),
                lifespan(3, { fade: 2 }),
            ])

            const bridgeCounter = onKeyPress('b', () => {
                showNotifications = true
            })

            wait(3, () => {
                bridgeCounter()
            })
        })
    })
}
