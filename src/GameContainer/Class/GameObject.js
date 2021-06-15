import Vec2 from './Vec2';
import constant from '../constant';

export class cymbal {
	constructor(pos) {
		this.pos = pos;
	}
	static draw(ctx) {
		ctx.beginPath();
		ctx.closePath();
	}
}
