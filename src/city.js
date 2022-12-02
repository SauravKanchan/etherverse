import {DIMENSION, SCALE} from './constant'
import {setOnMap} from './utils'


export const createCity = () => {

 const tile = {width: 16, height: 16}
  let map = []
  let row = ''
  for(let x=0; x < DIMENSION.x/(tile.width); x++){
    row += ' '
  }
  for(let y=0; y <  DIMENSION.y/(tile.width); y++){
    map.push(row)
  }

  const levelCfg = {
    width: tile.width,
    height: tile.height,
    ' ': () => [sprite('grass'), scale(1.25),layer("bg") ],
    '#': () => [sprite('mb'), area(),solid(),"build2"],
    '-': () => [sprite('bb'), area(),solid()],
    '!': () => [sprite('door')],
    'w': () => [sprite('window')]
  }

  return {map, levelCfg}
}
  
export const createBuilding = (map) => {
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

}
  
  
  
