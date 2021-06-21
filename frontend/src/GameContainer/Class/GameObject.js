import Vec2 from "./Vec2";
import constant from "../constant";

const w = constant.gridWidth;

export default class spikedBlock {
  constructor(pos) {
    this.pos = pos;

    this.detail = {
      name: "spikedBlock",
    };

    this.perspective = false;
  }
  setPerspective(perspective) {
    this.perspective = perspective;
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.pos.x, this.pos.y);

    ctx.globalAlpha = this.perspective ? 0.3 : 1;
    ctx.beginPath();
    ctx.moveTo(-0.5 * w, -0.5 * w);
    for (let i = 1; i <= 8; i++)
      ctx.lineTo((-0.5 + 0.125 * i) * w, (-0.5 - 0.25 * (i % 2)) * w);
    for (let i = 1; i <= 8; i++)
      ctx.lineTo((0.5 + 0.25 * (i % 2)) * w, (-0.5 + 0.125 * i) * w);
    for (let i = 1; i <= 8; i++)
      ctx.lineTo((0.5 - 0.125 * i) * w, (0.5 + 0.25 * (i % 2)) * w);
    for (let i = 1; i <= 8; i++)
      ctx.lineTo((-0.5 - 0.25 * (i % 2)) * w, (0.5 - 0.125 * i) * w);
    ctx.fillStyle = "#7B7B7B";
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(-0.5 * w, -0.5 * w, w, w);
    ctx.fillStyle = "#9D9D9D";
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();

    ctx.restore();
  }
}
