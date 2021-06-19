import * as api from '../Drawer';
import Vec2 from '../Class/Vec2';
import constant from '../constant';
import * as GameObject from '../Class/GameObject';

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
	for (let i = 0; i < constant.maxLayer; i++) {
		for (let j = 0; j < objects.length; j++) {
			if (objects[j].layer.top() === i) objects[j].draw(ctx);
		}
    }

	if (status.hold) {
		status.holdObject.draw(ctx);
    }

	/* 繪製編輯物件庫(這裡之後會重寫!) */
	ctx.save();
	const editObjectSpace = new Vec2(128, 128);
	const objectList = [
		new GameObject.spikedBlock(new Vec2(editObjectSpace.x * 0.5, editObjectSpace.y * 0.5)),
		new GameObject.platform(new Vec2(editObjectSpace.x * 1.5, editObjectSpace.y * 0.5)),
		new GameObject.bow(new Vec2(editObjectSpace.x * 2.5, editObjectSpace.y * 0.5)),
		new GameObject.movingPlatform(new Vec2(editObjectSpace.x * 3.5, editObjectSpace.y * 0.5)),
		new GameObject.mucus(new Vec2(editObjectSpace.x * 4.5, editObjectSpace.y * 0.5)),
	];
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