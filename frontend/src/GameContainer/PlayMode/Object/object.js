import Vec2 from "../../Class/Vec2";

export default class Object {
  constructor(id, x, y, velocity) {
    this.id = id;
    this.loc = new Vec2(x, y)
    this.velocity = velocity;
  }

  update(dt) {
    this.loc = this.loc.add( this.velocity.mul(dt) )
  }

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
