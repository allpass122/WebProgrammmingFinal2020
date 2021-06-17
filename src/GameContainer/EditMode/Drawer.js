import * as api from '../Drawer';
import Vec2 from '../Class/Vec2';
import constant from '../constant';
import spikedBlock from '../Class/GameObject';

function Drawer(ctx, setting, status) {
	let map = setting.map;
	let objects = setting.objects;

	/* 清空畫布 */
	api.clear(ctx);

	/* 繪製地圖 */
	ctx.save();
	ctx.translate(constant.mapStart.x, constant.mapStart.y); 
	const w = constant.gridWidth;
	api.drawMap(ctx, map);

	/* 繪製選擇格 */
	if (status.select) {
		let luPos = Vec2.leftUp(status.selectPair[0], status.selectPair[1]);
		let rdPos = Vec2.rightDown(status.selectPair[0], status.selectPair[1]);
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
		status.holdObject.draw(ctx);
    }

	/* 繪製編輯物件庫(這裡之後會重寫!) */
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