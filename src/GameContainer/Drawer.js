import Vec2 from './Class/Vec2';
import constant from './constant';

export function clear(ctx, pos = { x: 0, y: 0 }, size = { x: ctx.canvas.width, y: ctx.canvas.height }) {
	ctx.clearRect(pos.x, pos.y, size.x, size.y);
}

export function drawMap(ctx, mapSize, map) {
	const w = constant.gridWidth; // 暫時寫死
	const blockColor = '#E0E0E0'; // 暫時寫死
	const startColor = '#BBFFBB'; // 暫時寫死
	const endColor = '#FF9797'; // 暫時寫死
	const noneColor = '#FFFFFF'; // 暫時寫死
	const boundaryColor = '#0080FF'; // 暫時寫死
	const auxiliaryColor = '#D2E9FF'; // 暫時寫死
	const relation = (pos1, pos2) => {
		if (map[pos1.y][pos1.x].includes('none') && map[pos2.y][pos2.x].includes('none')) return 'n_n';
		if (map[pos1.y][pos1.x].includes('block') && map[pos2.y][pos2.x].includes('block')) return 'b_b';
		return 'n_b';
	};

	for (let y = 0; y < mapSize.y; y++) {
		for (let x = 0; x < mapSize.x; x++) {
			ctx.beginPath();
			ctx.rect(x * w, y * w, w, w);
			ctx.fillStyle = (map[y][x].includes('start')) ? startColor :
							(map[y][x].includes('end')) ? endColor :
							(map[y][x].includes('block')) ? blockColor : noneColor;
			ctx.fill();
			ctx.closePath();
		}
	}

	for (let y = 1; y < mapSize.y; y++) {
		for (let x = 0; x < mapSize.x; x++) {
			let r = relation(new Vec2(x, y - 1), new Vec2(x, y));
			if (r === 'b_b') continue;
			ctx.beginPath();
			ctx.moveTo(x * w, y * w);
			ctx.lineTo((x + 1) * w, y * w);
			ctx.strokeStyle = (r === 'n_b') ? boundaryColor : auxiliaryColor;
			ctx.stroke();
			ctx.closePath();
		}
	}

	for (let y = 0; y < mapSize.y; y++) {
		for (let x = 1; x < mapSize.x; x++) {
			let r = relation(new Vec2(x - 1, y), new Vec2(x, y));
			if (r === 'b_b') continue;
			ctx.beginPath();
			ctx.strokeStyle = (r === 'n_b') ? boundaryColor : auxiliaryColor;
			ctx.moveTo(x * w, y * w);
			ctx.lineTo(x * w, (y + 1) * w);
			ctx.stroke();
			ctx.closePath();
		}
	}
}