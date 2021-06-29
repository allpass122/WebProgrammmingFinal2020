import Vec2 from "../Class/Vec2";
import constant from "../constant"
import {CONSTANT, Msg} from "./PlayModeConstant"

const w = constant.gridWidth;
let blockArea = []

export function initState(status, setting) {
  const { map, objects } = setting

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

  // set object no transparant
  for (let i = 0; i < objects.length; i++) {
    if (objects[i].setPerspective) objects[i].setPerspective(false)
  }

  status.startTime = Date.now()
  status.lastUpdateTime = Date.now()
}

export function updateState(status, setting, setStatus) {
  const { map } = setting

  const dt = Date.now() - status.lastUpdateTime

  checkLocation(status, map, setStatus)
  checkEncounter(status, setting, setStatus)
  status.lastUpdateTime = Date.now()
  push(status)

  status.me.update(dt)

}

function push(status){
  let { pressDown, pressRight, pressLeft, pressUp } = status
  let [pushX, pushY] = [0, 0]
  if (pressDown) pushY += 1
  if (pressUp) pushY -= 1
  if (pressRight) pushX += 1
  if (pressLeft) pushX -= 1
  status.me.push(new Vec2(pushX, pushY))
}


function checkLocation(status, map, setStatus) {
  let { x, y } = status.me.serializeForUpdate()
  let {me} = status.me 
  const LeftBound = constant.mapStart.x + CONSTANT.PlayerR
  const RightBound = constant.mapStart.x + constant.mapSize.x * w - CONSTANT.PlayerR
  const UpperBound = constant.mapStart.y + CONSTANT.PlayerR
  const LowerBound = constant.mapStart.y + constant.mapSize.y * w - CONSTANT.PlayerR

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
      status.me.rebound(new Vec2(x, 9999))
  }

  // block 4 sides rebound
  blockArea.some(block => {
    if (x + CONSTANT.PlayerR > constant.mapStart.x + (block.x) * w
      && x - CONSTANT.PlayerR < constant.mapStart.x + (block.x + 1) * w
      && y + CONSTANT.PlayerR > constant.mapStart.y + (block.y) * w
      && y - CONSTANT.PlayerR < constant.mapStart.y + (block.y + 1) * w) {
      status.me.returnLastLoc()
      status.me.squareRebound(new Vec2(constant.mapStart.x + (block.x + 0.5) * w, constant.mapStart.y + (block.y + 0.5) * w))
      return true
    }
  })

  // check floor type & onPlateform
  let mapX = Math.floor((x - constant.mapStart.x) / w)
  let mapY = Math.floor((y - constant.mapStart.y) / w)
  // console.log('mapX', mapX, ' mapY', mapY)
  if ( (mapX < 0 || mapX > constant.mapSize.x) || (mapY < 0 || mapY > constant.mapSize.y) ) return
  const floorType = map[mapY][mapX].type
  status.me.resetFriction()
  if (status.me.onPlatform() ){
    status.me.setFriction(6)
  } else if (floorType.includes('none') || floorType.includes('start') || floorType.includes('end') )
    status.me.setFriction(1)
  else if (floorType.includes('muddy'))
    status.me.setFriction(5)
  else if (floorType.includes('ice'))
    status.me.setFriction(0.5)
  else if (floorType.includes('dead')) 
    setStatus( () => ({...status, gameState: CONSTANT.GameOver,msg: Msg["dead"], endTime: Date.now(), playTime:Date.now()-status.startTime })) 

  if (floorType.includes('end'))
    setStatus( () => ({...status, gameState: CONSTANT.WIN, msg: Msg["end"], endTime: Date.now(), playTime:Date.now()-status.startTime })) 

  status.me.updateLastLoc()
}


// check Live: Code from EditMode/Engine
function checkEncounter(status, setting, setStatus) {
  let {objects, map} = setting
  let { me } = status
  let onPlatform = false
  let platformID, platformPos
  let platformDistance = Math.MAX_SAFE_INTEGER
  let beBlocked = false
  let touchConveyor = 0
  
  for (let i = 0; i < objects.length; i++) {
    if (objects[i].collision) {
      const result = objects[i].collision({ type: 'sphere', pos: me.loc, r: CONSTANT.PlayerR });
      if (result.includes('none')) continue
      me.resetFriction()
      // console.log('result', result)
      if ( (result === 'block' || result === 'lockedWall' || result === 'cymbal' 
      || result === 'missileBase' || result === 'woodenBox') && !beBlocked ) {
        if (result === 'woodenBox') objects[i].push(objects, map, me.pos);
        beBlocked = true
        me.returnLastLoc()
        me.squareRebound(objects[i].pos)
      }
      // me.loc.length( objects[i].pos) < platformDistance: find the closest platform to transport
      else if (result === 'platform' || result === 'movingPlatform' || result === 'brokenPlatform' 
                || me.loc.length( objects[i].pos) < platformDistance ) {
        if (result === 'brokenPlatform') objects[i].break();
        onPlatform = true
        platformDistance =  me.loc.length( objects[i].pos)
        platformID = i
        platformPos = objects[i].pos
        status.me.setFriction(3)
      } else if (result === 'unlocker') objects[i].unlock(objects)
      else if (result === 'portal') me.moveTo(objects[i].teleport(objects)) 
      else if (result === 'conveyor' && touchConveyor < 0.99 ) {
        me.addVelocity(objects[i].detail.direction, 12)
        touchConveyor++
      } else if (result === 'missileRay') objects[i].fire(me);
      else if (result === 'trap') me.setLastFriction()
      else if (result === 'magneticField') 
      // me.pull(objects[i].getDisplacement().mul(1000)) BUG
      me.loc = me.loc.add(objects[i].getDisplacement())
      else if ( result === 'spike' || result === 'arrow' ||  result === 'cymbalWave' || result === 'missile' || result === 'deathTotem' ){
        setStatus( () => ({...status, gameState: CONSTANT.GameOver, msg: Msg[result],endTime: Date.now(), playTime:Date.now()-status.startTime})) 
      }

      // floor 
      if (result === 'mucus')
        status.me.setFriction(10)
      else if (result === 'ice')
        status.me.setFriction(0.4)
    }
  }
  // platForm logic
  if (onPlatform && !beBlocked)
    me.moveOnPlatform(platformID , platformPos)
  if ( !onPlatform )
    me.leavePlatform()
}


