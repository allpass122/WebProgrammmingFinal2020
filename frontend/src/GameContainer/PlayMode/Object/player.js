// import ObjectClass from './object';
import Vec2 from '../../Class/Vec2';
const PUSH_FORCE = 800
const FRICTION = 0.09
const MAX_VELOCITY = 160

export default class Player {
  constructor(id, username, x, y) {
    this.id = id;
    this.loc = new Vec2(x, y);
    this.velocity = new Vec2(0, 0);
    this.username = username;
    this.score = 0;
    this.pos = new Vec2(0, 0)

    this.friction = FRICTION
    this.lastFriction = 0
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
    const v2 = this.velocity.unit().mul( Math.pow(this.velocity.length(),2))
    this.acceleration = this.force.sub(v2.mul(this.friction)).div(this.m)

    // velocity change
    this.velocity = this.velocity.add(this.acceleration.mul(dt))
    // somthing cause velocity exceed
    this.checkVelocity()

    // location change
    this.loc = this.loc.add( this.velocity.mul(dt) )
    this.force = new Vec2(0, 0)
  }

  checkVelocity() {
    if (this.velocity.length() > MAX_VELOCITY)
    this.velocity = this.velocity.unit().mul(MAX_VELOCITY)
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
    // bound lower, left, upper, right in order
    if (-3 / 4 * Math.PI < Theta && Theta < -1 / 4 * Math.PI)
      this.rebound(new Vec2(this.loc.x, 9999))
    else if (-1 / 4 * Math.PI < Theta && Theta < 1 / 4 * Math.PI)
      this.rebound(new Vec2(0, this.loc.y))
    else if (1 / 4 * Math.PI < Theta && Theta < 3 / 4 * Math.PI)
      this.rebound(new Vec2(this.loc.x, 0))
    else if (3 / 4 * Math.PI < Theta || (-3 / 4 * Math.PI > Theta && Theta < 0))
      this.rebound(new Vec2(9999, this.loc.y))
    else
      console.log("why? no bound")
  }

  /* reflect by this.velocity, but have bug */
  // rebound(target) {
  //   const normal = (new Vec2(this.loc.x - target.x, this.loc.y - target.y))
  //   const reflectLineTheta = Math.atan2(normal.y, normal.x) + 0.5 * Math.PI
  //   const newVelocityX = Math.cos(2 * reflectLineTheta) * this.velocity.x + Math.sin(2 * reflectLineTheta) * this.velocity.y
  //   const newVelocityY = Math.sin(2 * reflectLineTheta) * this.velocity.x - Math.cos(2 * reflectLineTheta) * this.velocity.y
  //   this.velocity = new Vec2(newVelocityX, newVelocityY).mul(4)
  //   this.checkVelocity()
  // }

  rebound(target) {
    const normal = new Vec2(this.loc.x - target.x, this.loc.y - target.y)
    const reflectLineTheta = Math.atan2(normal.y, normal.x) + 0.5 * Math.PI
    const vec = normal.mul(-1).unit()
    const newVelocityX = Math.cos(2 * reflectLineTheta) * vec.x + Math.sin(2 * reflectLineTheta) * vec.y
    const newVelocityY = Math.sin(2 * reflectLineTheta) * vec.x - Math.cos(2 * reflectLineTheta) * vec.y
    this.velocity = new Vec2(newVelocityX, newVelocityY).mul(40)
    this.checkVelocity()
  }

  returnLastLoc(dt) {
    this.loc = this.lastLoc
  }

  setFriction(ratio) {
    this.lastFriction = this.friction
    this.friction = this.friction * ratio
  }
  setLastFriction() {
    this.friction = this.lastFriction
  }
  resetFriction() {
    this.lastFriction = this.friction
    this.friction = FRICTION 
  }

  updateLastLoc() {
    this.lastLoc = this.loc
  }
  // manipulate by key: left, up, right, down 
  push(vec) {
    this.force = vec.mul(PUSH_FORCE)
  }

  // pull(vec) {
  //   console.log(vec)
  //   this.force = this.force.add(vec)
  // }

  serializeForUpdate() {
    return {
      id: this.id,
      loc: this.loc,
      x: this.loc.x,
      y: this.loc.y,
      velocity: this.velocity
    };
  }
}

