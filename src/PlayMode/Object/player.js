// const ObjectClass = require('./object');
// const Bullet = require('./bullet');
// const Constants = require('../shared/constants');
import ObjectClass from './object';
import Constants from '../../shared/constants';
import Vec2 from '../../GameContainer/Class/Vec2';
const PUSH_FORCE = 300

export default class Player extends ObjectClass {
  constructor(id, username, x, y) {
    super(id, x, y, Math.random() * 2 * Math.PI, new Vec2(1,1));
    this.username = username;
    this.hp = Constants.PLAYER_MAX_HP;
    this.fireCooldown = 0;
    this.score = 0;

    this.friction = 0.03
    this.m = 1
    this.force =  new Vec2(0, 0)
    this.acceleration =  new Vec2(0, 0)
  }

  // Returns a newly created bullet, or null.
  update(dt) {
    // ms to s
    dt = dt / 1000 

    this.updateFAV(dt)


    // Update score
    this.score += dt * Constants.SCORE_PER_SECOND;

    // Make sure the player stays in bounds
    // this.x = Math.max(0, Math.min(Constants.MAP_SIZE, this.x));
    // this.y = Math.max(0, Math.min(Constants.MAP_SIZE, this.y));

    // Fire a bullet, if needed
    this.fireCooldown -= dt;
    if (this.fireCooldown <= 0) {
      this.fireCooldown += Constants.PLAYER_FIRE_COOLDOWN;
      // return new Bullet(this.id, this.x, this.y, this.direction);
    }

    return null;
  }

  updateFAV(dt) {
    // acceleration change  a = (F + f*v*v) / m
    const v2 = new Vec2( this.velocity.x*Math.abs(this.velocity.x), this.velocity.y*Math.abs(this.velocity.y) )
    this.acceleration = this.force.sub( v2.mul(this.friction)).div(this.m)

    // velocity change
    this.velocity = this.velocity.add( this.acceleration.mul(dt) )
    console.log('vel = ', this.velocity)

    // location change
    super.update(dt);
    this.force = new Vec2(0, 0)
  }
  moveTo(x,y) {
    this.loc = new Vec2(x, y)
  }

  push(dir) {
    switch (dir) {
      case 'down':
        this.force = new Vec2(0, PUSH_FORCE)
        break
      case 'right':
        this.force = new Vec2(PUSH_FORCE, 0)
        break
      case 'left':
        this.force = new Vec2(-PUSH_FORCE, 0)
        break
      case 'up':
        this.force = new Vec2(0, -PUSH_FORCE)
          break 
      default:
        console.log("move direction not handled")
    } 
    // if (this.force.x > FORCE_MAX ) this.force = new Vec2(FORCE_MAX, this.force.y)
  }

  // takeBulletDamage() {
  //   this.hp -= Constants.BULLET_DAMAGE;
  // }

  // onDealtDamage() {
  //   this.score += Constants.SCORE_BULLET_HIT;
  // }

  serializeForUpdate() {
    console.log('player loc ',this.loc.x, this.loc.y)
    return {
      ...(super.serializeForUpdate()),
      direction: this.direction,
      hp: this.hp,
    };
  }
}

// module.exports = Player;
