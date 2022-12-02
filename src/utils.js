export const setCharAt = (str,index,chr) => {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
}

export const setOnMap = (map, x, y, char) => {
    if (y > map.length) return map
    map[y] = setCharAt(map[y], x, char)
    return map
}