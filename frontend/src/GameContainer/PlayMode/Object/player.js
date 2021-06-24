import ObjectClass from './object';
import Vec2 from '../../Class/Vec2';
const PUSH_FORCE = 800
const FRICTION = 0.08

export default class Player extends ObjectClass {
  constructor(id, username, x, y) {
    super(id, x, y, new Vec2(0, 0));
    this.username = username;
    this.score = 0;
    this.pos = new Vec2(0, 0)

    this.friction = FRICTION
    this.m = 1
    this.force = new Vec2(0, 0)
    this.acceleration = new Vec2(0, 0)
    this.lastLoc = new Vec2(x, y)
    this.lastPlatformID = "-1" 
    this.lastPlatformPos = new Vec2(0, 0)
  }


  update(dt) {
    // ms to s
    dt = dt / 1000
    this.updateFAV(dt)
    this.pos = this.loc
    return null;
  }

  updateFAV(dt) {
    // acceleration change  a = (F + f*v*v) / m
    // const v2 = new Vec2(this.velocity.x * Math.abs(this.velocity.x), this.velocity.y * Math.abs(this.velocity.y))
    const v2 = this.velocity.unit().mul( Math.pow(this.velocity.length(),2))
    this.acceleration = this.force.sub(v2.mul(this.friction)).div(this.m)

    // velocity change
    this.velocity = this.velocity.add(this.acceleration.mul(dt))

    // location change
    super.update(dt);
    this.force = new Vec2(0, 0)
  }

  moveTo(x, y) {
    if (!y){
      const newLoc = x
      this.loc = newLoc
    } else this.loc = new Vec2(x, y)
  }

  addVelocity(dir, vel) {
    switch (dir) {
      case 'down':
        this.velocity = this.velocity.add(new Vec2(0, vel))
        break
      case 'right':
        this.velocity = this.velocity.add(new Vec2(vel, 0))
        break
      case 'left':
        this.velocity = this.velocity.add(new Vec2(-vel, 0))
        break
      case 'up':
        this.velocity = this.velocity.add(new Vec2(0, -vel))
        break
    }
  }

  moveOnPlatform(id, platformPos) {
    id = id.toString()
    // meet a platform or change a platform
    if(this.lastPlatformID === "-1" || this.lastPlatformID !== id ){
      this.lastPlatformID = id
      this.lastPlatformPos = platformPos
    }
    if(this.lastPlatformID === id){
      this.loc = this.loc.add( platformPos.sub(this.lastPlatformPos) )
      this.lastPlatformPos = platformPos
    }
  }

  leavePlatform() {
    this.lastPlatformID = "-1"
  }

  onPlatform() {
    if (this.lastPlatformID === "-1")
      return false
    else return true
  }

  squareRebound(target) {
    const vector = (new Vec2(this.loc.x - target.x, this.loc.y - target.y))
    const Theta = Math.atan2(vector.y, vector.x)
    // console.log(Theta)
    // bound lower, left, upper, right in order
    if (-3 / 4 * Math.PI < Theta && Theta < -1 / 4 * Math.PI)
      this.rebound(new Vec2(this.loc.x, 999))
    else if (-1 / 4 * Math.PI < Theta && Theta < 1 / 4 * Math.PI)
      this.rebound(new Vec2(0, this.loc.y))
    else if (1 / 4 * Math.PI < Theta && Theta < 3 / 4 * Math.PI)
      this.rebound(new Vec2(this.loc.x, 0))
    else if (3 / 4 * Math.PI < Theta || (-3 / 4 * Math.PI > Theta && Theta < 0))
      this.rebound(new Vec2(999, this.loc.y))
    else
      console.log("why? no bound")
  }

  rebound(target) {
    // console.log('rebound', target)
    const normal = (new Vec2(this.loc.x - target.x, this.loc.y - target.y))
    const reflectLineTheta = Math.atan2(normal.y, normal.x) + 0.5 * Math.PI
    const newVelocityX = Math.cos(2 * reflectLineTheta) * this.velocity.x + Math.sin(2 * reflectLineTheta) * this.velocity.y
    const newVelocityY = Math.sin(2 * reflectLineTheta) * this.velocity.x - Math.cos(2 * reflectLineTheta) * this.velocity.y
    this.velocity = new Vec2(newVelocityX, newVelocityY)
  }


  returnLastLoc(dt) {
    this.loc = this.lastLoc
  }

  setFriction(ratio) {
    this.friction = FRICTION * ratio
  }

  updateLastLoc() {
    this.lastLoc = this.loc
  }

  push(vec) {
    this.force = vec.mul(PUSH_FORCE)
  }


  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
    };
  }
}

