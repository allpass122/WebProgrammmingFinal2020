import Vec2 from "../../GameContainer/Class/Vec2";

export default class Object {
  constructor(id, x, y, dir, velocity) {
    this.id = id;
    // this.x = x;
    // this.y = y;
    this.loc = new Vec2(x, y)
    this.direction = dir;
    this.velocity = velocity;
  }

  update(dt) {
    // console.log('dt/1000',dt/1000)
    // console.log('this speed', this.speed)
    this.loc = this.loc.add( this.velocity.mul(dt) )
  }

  // distanceTo(object) {
  //   const dx = this.x - object.x;
  //   const dy = this.y - object.y;
  //   return Math.sqrt(dx * dx + dy * dy);
  // }

  // setDirection(dir) {
  //   this.direction = dir;
  // }

  serializeForUpdate() {
    return {
      id: this.id,
      loc: this.loc,
      x: this.loc.x,
      y: this.loc.y,
    };
  }
}

// module.exports = Object;
