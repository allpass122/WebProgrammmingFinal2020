import * as api from '../Drawer';
import Vec2 from '../Class/Vec2';
import constant from '../constant';
import spikedBlock from '../Class/GameObject';

function Drawer(ctx, setting, status) {
	let mapSize = setting.mapSize;
	let map = setting.map;
	let objects = setting.objects;

	/* 清空畫布 */
	api.clear(ctx);

	/* 繪製地圖 */
	ctx.save();
	ctx.translate(88, 44); // 暫時寫死
	const w = constant.gridWidth;
	api.drawMap(ctx, mapSize, map);

	/* 繪製選擇格 */
	const leftUpPos = (p1, p2) => (new Vec2(Math.min(p1.x, p2.x), Math.min(p1.y, p2.y)));
	const RightDownPos = (p1, p2) => (new Vec2(Math.max(p1.x, p2.x), Math.max(p1.y, p2.y)));

	if (status.select) {
		let luPos = leftUpPos(status.selectPair[0], status.selectPair[1]);
		let rdPos = RightDownPos(status.selectPair[0], status.selectPair[1]);
		let range = rdPos.sub(luPos).add(new Vec2(1, 1));

		ctx.save();
		ctx.beginPath();
		ctx.rect(luPos.x * w, luPos.y * w, range.x * w, range.y * w);
		ctx.setLineDash([0.5, 0,5]);
		ctx.strokeStyle = 'black';
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
	}

	ctx.restore();

	/* 繪製物件 */
	for (let i = 0; i < objects.length; i++) {
		objects[i].draw(ctx);
	}

	if (status.hold) {
		if (status.holdObject.pos.between(new Vec2(88, 44), new Vec2(1112, 556))) {
			status.holdObject.pos = status.holdObject.pos.sub(new Vec2(88, 44)).toGrid(w).mul(w).add(new Vec2(88 + 0.5 * w, 44 + 0.5 * w));
		}
		status.holdObject.draw(ctx);
    }

	/* 繪製編輯物件庫 */
	ctx.save();
	const editObjectSpace = new Vec2(128, 128);
	const objectList = [new spikedBlock(new Vec2(editObjectSpace.x * 0.5, editObjectSpace.y * 0.5))];
	ctx.translate(88, 560);
	for (let i = 0; i < 8; i++) {
		ctx.beginPath();
		ctx.rect(0 + editObjectSpace.x * i, 0, editObjectSpace.x, editObjectSpace.y);
		ctx.strokeStyle = constant.auxiliaryColor;
		ctx.stroke();
		ctx.closePath();

		if (objectList[i]) objectList[i].draw(ctx);
    }
	ctx.restore();
}

export default Drawer;