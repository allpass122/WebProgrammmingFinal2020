import Vec2 from "../../Class/Vec2";

export default class Object {
  constructor(id, x, y, dir, velocity) {
    this.id = id;
    this.loc = new Vec2(x, y)
    this.direction = dir;
    this.velocity = velocity;
  }

  update(dt) {
    this.loc = this.loc.add( this.velocity.mul(dt) )
  }

  // distanceTo(object) {
  //   const dx = this.x - object.x;
  //   const dy = this.y - object.y;
  //   return Math.sqrt(dx * dx + dy * dy);
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
