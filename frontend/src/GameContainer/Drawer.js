import Vec2 from './Class/Vec2';
import constant from './constant';

export function clear(ctx, pos = { x: 0, y: 0 }, size = { x: ctx.canvas.width, y: ctx.canvas.height }) {
	ctx.clearRect(pos.x, pos.y, size.x, size.y);
}

export function drawMap(ctx, map, playMode = false) {
	const mapSize = constant.mapSize;
	const w = constant.gridWidth; 
	const blockColor = constant.blockColor;
	const startColor = constant.startColor;
	const endColor = constant.endColor;
	const noneColor = constant.noneColor;
	const deadColor = constant.deadColor;
	const iceColor = constant.iceColor;
	const muddyColor = constant.muddyColor;
	const boundaryColor = constant.boundaryColor;
	const auxiliaryColor = constant.auxiliaryColor; 
	const relation = (pos1, pos2) => {
		if (map[pos1.y][pos1.x].type.includes('block') && map[pos2.y][pos2.x].type.includes('block')) return 'b_b';
		if (map[pos1.y][pos1.x].type.includes('block') || map[pos2.y][pos2.x].type.includes('block')) return 'n_b';
		return 'n_n';
	};

	for (let y = 0; y < mapSize.y; y++) {
		for (let x = 0; x < mapSize.x; x++) {
			if (map[y][x].type === 'block') continue;
			ctx.save();
			ctx.beginPath();
			ctx.rect(x * w, y * w, w, w);
			ctx.fillStyle = (map[y][x].type.includes('start')) ? startColor :
							(map[y][x].type.includes('end')) ? endColor :
							(map[y][x].type.includes('dead')) ? deadColor :
							(map[y][x].type.includes('ice')) ? iceColor :
							(map[y][x].type.includes('muddy')) ? muddyColor : noneColor;
			ctx.fill();
			ctx.closePath();

			ctx.restore();
		}
	}
	if (!playMode) {
		for (let y = 1; y < mapSize.y; y++) {
			ctx.beginPath();
			ctx.moveTo(0, y * w);
			ctx.lineTo(mapSize.x * w, y * w);
			ctx.strokeStyle = auxiliaryColor;
			ctx.stroke();
			ctx.closePath();
		}
		for (let x = 0; x < mapSize.x; x++) {
			ctx.beginPath();
			ctx.moveTo(x * w, 0);
			ctx.lineTo(x * w, mapSize.y * w);
			ctx.strokeStyle = auxiliaryColor;
			ctx.stroke();
			ctx.closePath();
		}
	}
	for (let y = 0; y <= mapSize.y; y++) {
		for (let x = 0; x <= mapSize.x; x++) {
			ctx.save();
			if (x >= 0 && x < mapSize.x && y >= 0 && y < mapSize.y) {
				if (map[y][x].type === 'block') {
					ctx.beginPath();
					ctx.rect(x * w, y * w, w, w);
					ctx.fillStyle = blockColor;
					ctx.fill();
					ctx.closePath();
				}
			}

		/* 繪製橫向格線 */
			if (x !== mapSize.x) {
				if (y > 0 && y < mapSize.y) {
					let r = relation(new Vec2(x, y - 1), new Vec2(x, y));
					if (r === 'n_b') {
						ctx.beginPath();
						ctx.moveTo(x * w, y * w);
						ctx.lineTo((x + 1) * w, y * w);
						ctx.strokeStyle = boundaryColor;
						ctx.stroke();
						ctx.closePath();
					}
				} else {
					if (y === 0) {
						if (map[y][x].type !== 'block') {
							ctx.beginPath();
							ctx.moveTo(x * w, y * w);
							ctx.lineTo((x + 1) * w, y * w);
							ctx.strokeStyle = boundaryColor;
							ctx.stroke();
							ctx.closePath();
						}
					}
					if (y === mapSize.y) {
						if (map[y - 1][x].type !== 'block') {
							ctx.beginPath();
							ctx.moveTo(x * w, y * w);
							ctx.lineTo((x + 1) * w, y * w);
							ctx.strokeStyle = boundaryColor;
							ctx.stroke();
							ctx.closePath();
						}
					}
				}
			}

		/* 繪製縱向格線 */
			if (y !== mapSize.y) {
				if (x > 0 && x < mapSize.x) {
					let r = relation(new Vec2(x - 1, y), new Vec2(x, y));
					if (r === 'n_b') {
						ctx.beginPath();
						ctx.moveTo(x * w, y * w);
						ctx.lineTo(x * w, (y + 1) * w);
						ctx.strokeStyle = boundaryColor;
						ctx.stroke();
						ctx.closePath();
					}
				} else {
					if (x === 0) {
						if (map[y][x].type !== 'block') {
							ctx.beginPath();
							ctx.moveTo(x * w, y * w);
							ctx.lineTo(x * w, (y + 1) * w);
							ctx.strokeStyle = boundaryColor;
							ctx.stroke();
							ctx.closePath();
						}
					}
					if (x === mapSize.x) {
						if (map[y][x - 1].type !== 'block') {
							ctx.beginPath();
							ctx.moveTo(x * w, y * w);
							ctx.lineTo(x * w, (y + 1) * w);
							ctx.strokeStyle = boundaryColor;
							ctx.stroke();
							ctx.closePath();
						}
					}
				}
			}
			ctx.restore();

		}
	}
}

export function drawPlayKey(ctx, size = 1) {
	ctx.save();
	ctx.scale(size, size);

	ctx.beginPath();
	ctx.moveTo(-0.3, 0);
	ctx.arcTo(-0.3, -0.5, 0.5, 0, 0.1);
	ctx.arcTo(0.5, 0, -0.3, 0.5, 0.1);
	ctx.arcTo(-0.3, 0.5, -0.3, 0, 0.1);
	ctx.lineTo(-0.3, 0);
	ctx.fillStyle = 'green';
	ctx.fill();
	ctx.closePath();

	ctx.restore();
}

export function drawStopKey(ctx, size = 1) {
	ctx.save();
	ctx.scale(size, size);
	ctx.fillStyle = 'red';

	ctx.beginPath();
	ctx.moveTo(-0.35, 0);
	ctx.arcTo(-0.35, -0.5, -0.15, -0.5, 0.1);
	ctx.arcTo(-0.15, -0.5, -0.15, 0.5, 0.1);
	ctx.arcTo(-0.15, 0.5, -0.35, 0.5, 0.1);
	ctx.arcTo(-0.35, 0.5, -0.35, 0, 0.1);
	ctx.lineTo(-0.35, 0);
	ctx.fill();
	ctx.closePath();

	ctx.beginPath();
	ctx.moveTo(0.35, 0);
	ctx.arcTo(0.35, -0.5, 0.15, -0.5, 0.1);
	ctx.arcTo(0.15, -0.5, 0.15, 0.5, 0.1);
	ctx.arcTo(0.15, 0.5, 0.35, 0.5, 0.1);
	ctx.arcTo(0.35, 0.5, 0.35, 0, 0.1);
	ctx.lineTo(0.35, 0);
	ctx.fill();
	ctx.closePath();

	ctx.restore();
}

export function drawTrashCan(ctx, size = 1) {
	ctx.save();
	ctx.scale(size, size);
	ctx.lineWidth = 0.06;
	ctx.strokeStyle = 'gray';

	for (let i = 0; i < 3; i++) {
		ctx.beginPath();
		ctx.moveTo(-0.2 + 0.2 * i, 0);
		ctx.lineTo(-0.2 + 0.2 * i, 0.4);
		ctx.stroke();
		ctx.closePath();
	}

	ctx.beginPath();
	ctx.moveTo(-0.4, -0.2);
	ctx.arcTo(-0.4, 0.6, 0.4, 0.6, 0.1);
	ctx.arcTo(0.4, 0.6, 0.4, -0.2, 0.1);
	ctx.lineTo(0.4, -0.2);
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.moveTo(-0.5, -0.4);
	ctx.lineTo(0.5, -0.4);
	ctx.lineTo(0.5, -0.2);
	ctx.lineTo(-0.5, -0.2);
	ctx.lineTo(-0.5, -0.4);
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.moveTo(-0.2, -0.4);
	ctx.lineTo(-0.2, -0.6);
	ctx.lineTo(0.2, -0.6);
	ctx.lineTo(0.2, -0.4);
	ctx.stroke();
	ctx.closePath();

	ctx.restore();
}