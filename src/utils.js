export const setCharAt = (str,index,chr) => {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
}

export const setOnMap = (map, x, y, char) => {
    if (y >= map.length) return map
    map[y] = setCharAt(map[y], x, char)
    return map
}

export const changeRoom = (player,obj,hover_text,func) => {   
    player.onCollide(obj, (d) => {
        if (!player.text?.parent) {
          player.text = add([
            text(hover_text),
            scale(0.2),
            layer("ui"),
            pos(player.pos.x, player.pos.y),
            lifespan(3, { fade: 2 }),
          ]);
        } else {
            console.log(player.text)
        }
    });  
    
    keyDown("x", () => {
        get(obj).forEach(g => {
          if (player.isTouching(g)) {
              func()
          }
        })
    }); 
}