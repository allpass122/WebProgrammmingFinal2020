import Vec2 from './Vec2';

const w = 32;

export class cymbal {
	constructor(pos) {
		this.pos = pos;
	}
	static draw(ctx) {
		ctx.beginPath();
		ctx.closePath();
	}
}
