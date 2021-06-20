import constant from "../GameContainer/constant"
import Player from "./Object/player";


export function initState(status, setting){
  const { mapSize, map, objects } = setting
	const w = constant.gridWidth; 

  // random player start area
  const startArea = []
  map.forEach( (line, y) => ( line.forEach( (square, x) => { 
    if(square.type.includes('start')) startArea.push({x,y}) 
  } )  ) )
  const {x, y} = startArea[ Math.floor(Math.random() * startArea.length) ]
  status.me.moveTo( constant.mapStart.x + (x+0.5)*w, constant.mapStart.y + (y+0.5)*w)
  status.startTime = Date.now()
  status.lastUpdateTime = Date.now()
}

export function updateState(status) {
  const dt = Date.now() - status.lastUpdateTime

  status.me.update(dt)

  status.lastUpdateTime = Date.now()
}


