import * as api from '../Drawer';
import Vec2 from '../Class/Vec2';

function Drawer(ctx, setting, events) {
	let mapSize = setting.mapSize;
	let map = setting.map;

	/* 清空畫布 */
	api.clear(ctx);

	/* 繪製地圖 */
	ctx.save();
	ctx.translate(88, 44); // 暫時寫死
	const w = 32;
	api.drawMap(ctx, mapSize, map);

	/* 繪製選擇格 */
	if (events.select) {
		for (let i = 0; i < events.selectList.length; i++) {
			ctx.beginPath();
			ctx.rect(events.selectList[i].x * w, events.selectList[i].y * w, w, w);
			ctx.strokeStyle = 'black';
			ctx.stroke();
			ctx.closePath();
		}
	}

	ctx.restore();
}

export default Drawer;