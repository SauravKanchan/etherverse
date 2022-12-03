import { IS_LOCK } from './store.js';
let lock;

IS_LOCK.subscribe(value => {
    lock = value;
});

export const setCharAt = (str,index,chr) => {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
}

export const setOnMap = (map, x, y, char) => {
    if (y >= map.length) return map
    map[y] = setCharAt(map[y], x, char)
    return map
}

export const changeRoom = (player,obj,hover_text,func, text_displacement={x: 0, y:0}) => {
    player.onCollide(obj, (d) => {
        if(lock) return
        if (!player.text?.parent) {
          player.text = add([
            text(hover_text),
            scale(0.2),
            layer("ui"),
            pos(player.pos.x + text_displacement.x, player.pos.y+text_displacement.y),
            lifespan(3, { fade: 2 }),
          ]);
        }
    });  
    
   keyDown('x', ()=> {
        if(lock) return
        get(obj).forEach(g => {
            if (player.isTouching(g)) {
                func()
                IS_LOCK.set(true)
                    setTimeout(()=>{
                    IS_LOCK.set(false)
                }, 1000)
            }
        })
    }); 
}
