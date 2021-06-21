import Vec2 from "../GameContainer/Class/Vec2";
import constant from "../GameContainer/constant"
import CONSTANT from "./PlayModeConstant";

const w = constant.gridWidth;
let blockArea = []

export function initState(status, setting) {
  const { mapSize, map, objects } = setting

  // random player start area
  const startArea = []
  map.forEach((line, y) => (line.forEach((square, x) => {
    if (square.type.includes('start')) startArea.push({ x, y })
  })))
  const { x, y } = startArea[Math.floor(Math.random() * startArea.length)]
  status.me.moveTo(constant.mapStart.x + (x + 0.5) * w, constant.mapStart.y + (y + 0.5) * w)

  blockArea = []
  map.forEach((line, y) => (line.forEach((square, x) => {
    if (square.type.includes('block')) blockArea.push({ x, y })
  })))
  console.log(blockArea.length)

  status.startTime = Date.now()
  status.lastUpdateTime = Date.now()
}

export function updateState(status, setting, setStatus) {
  const { mapSize, map, objects } = setting

  const dt = Date.now() - status.lastUpdateTime

  status.me.update(dt)
  checkLocation(status, map)
  checkLive(status, objects, setStatus)

  status.lastUpdateTime = Date.now()
}

function checkLocation(status, map) {
  let { x, y } = status.me.serializeForUpdate()
  const LeftBound = constant.mapStart.x + 0.5 * w
  const RightBound = constant.mapStart.x + constant.mapSize.x * w - 0.5 * w
  const UpperBound = constant.mapStart.y + 0.5 * w
  const LowerBound = constant.mapStart.y + constant.mapSize.y * w - 0.5 * w

  // canvas 4 sides rebound
  if (x < LeftBound || x > RightBound || y < UpperBound || y > LowerBound) {
    status.me.returnLastLoc()
    if (x < LeftBound)
      status.me.rebound(new Vec2(LeftBound - w, y))
    else if (x > RightBound)
      status.me.rebound(new Vec2(RightBound + w, y))
    else if (y < UpperBound)
      status.me.rebound(new Vec2(x, UpperBound - w))
    else if (y > LowerBound)
      status.me.rebound(new Vec2(x, 999))
  }

  // block 4 sides rebound
  blockArea.some(block => {
    if (x + CONSTANT.PlayerR > constant.mapStart.x + (block.x) * w
      && x - CONSTANT.PlayerR < constant.mapStart.x + (block.x + 1) * w
      && y + CONSTANT.PlayerR > constant.mapStart.y + (block.y) * w
      && y - CONSTANT.PlayerR < constant.mapStart.y + (block.y + 1) * w) {
      status.me.returnLastLoc()
      status.me.squareRebound(new Vec2(constant.mapStart.x + (block.x + 0.5) * w, constant.mapStart.y + (block.y + 0.5) * w))
      // return true break Array.some()
      return true
    }
  })

  // check floor type
  let mapX = Math.floor((x - constant.mapStart.x) / w)
  let mapY = Math.floor((y - constant.mapStart.y) / w)
  const floorType = map[mapY][mapX].type
  if (floorType.includes('none'))
    status.me.setFriction(1)
  else if (floorType.includes('muddy'))
    status.me.setFriction(15)
  else if (floorType.includes('ice'))
    status.me.setFriction(0.1)

  status.me.updateLastLoc()
}

// check Live: Code from EditMode/Engine
function checkLive(status, objects, setStatus) {
  let {me, gameState} = status
  for (let i = 0; i < objects.length; i++) {
      if (objects[i].collision) {
          const result = objects[i].collision({ type: 'sphere', pos: me.loc, r: CONSTANT.PlayerR });
          console.log(result)
          if ( result === 'block')
            status.me.squareRebound(objects[i].pos )
          else if ( result != 'none') setStatus( () => ({...status, gameState: CONSTANT.GameOver})) 
      }
  }
}

