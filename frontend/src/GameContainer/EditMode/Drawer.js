import * as api from '../Drawer';
import Vec2 from '../Class/Vec2';
import constant from '../constant';
import * as GameObject from '../Class/GameObject';

function Drawer(ctx, setting, status) {
	let map = setting.map;
	let objects = setting.objects;
	const w = constant.gridWidth;


	/* 清空畫布 */
	api.clear(ctx);

	ctx.save();
	ctx.rect(constant.mapStart.x, constant.mapStart.y, constant.mapSize.x * w, constant.mapSize.y * w);
	ctx.clip();

	/* 繪製地圖 */
	ctx.save();
	ctx.translate(constant.mapStart.x, constant.mapStart.y);
	api.drawMap(ctx, map);

	/* 繪製選擇格 */
	if (status.select) {
		let luPos = Vec2.leftUp(status.selectPair[0], status.selectPair[1]);
		let rdPos = Vec2.rightDown(status.selectPair[0], status.selectPair[1]);
		let range = rdPos.sub(luPos).add(new Vec2(1, 1));

		ctx.save();
		ctx.beginPath();
		ctx.rect(luPos.x * w, luPos.y * w, range.x * w, range.y * w);
		ctx.setLineDash([0.5, 0, 5]);
		ctx.strokeStyle = 'black';
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
	}

	ctx.restore();

	/* 繪製物件 */
	for (let i = 0; i < constant.maxLayer; i++) {
		for (let j = 0; j < objects.length; j++) {
			if (objects[j].layer.status[i]) objects[j].draw(ctx, i);
		}
	}

	ctx.restore();

	/* 繪製編輯物件庫 */
	ctx.save();
	const editObjectSpace = new Vec2(64, 64);
	const objectList = [];
	objectList.push('class platform');
	if (status.opt === 1) objectList.push(...constant.editObjectList.platform);
	objectList.push('class covering');
	if (status.opt === 2) objectList.push(...constant.editObjectList.covering);
	objectList.push('class obstacle');
	if (status.opt === 3) objectList.push(...constant.editObjectList.obstacle);
	objectList.push('class special');
	if (status.opt === 4) objectList.push(...constant.editObjectList.special);
	ctx.translate(88, 516);

	for (let i = 0; i < 16; i++) {
		let o = null, type = 'default', fColor, sColor;
		if (objectList[i - 1]) {
			switch (objectList[i - 1]) {
				case 'class platform':
					type = 'class';
					if (status.opt === 1) {
						let pos = new Vec2(editObjectSpace.x * (i + 0.5), editObjectSpace.y * 0.5);
						let grd = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 1.5 * w);
						grd.addColorStop(0, constant.editFrame['platform'].fColor);
						grd.addColorStop(1, '#B9B9FF');
						fColor = grd;
					} else fColor = '#B9B9FF';
					sColor = '#9393FF';
					break;
				case 'class covering':
					type = 'class';
					if (status.opt === 2) {
						let pos = new Vec2(editObjectSpace.x * (i + 0.5), editObjectSpace.y * 0.5);
						let grd = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 1.5 * w);
						grd.addColorStop(0, constant.editFrame['covering'].fColor);
						grd.addColorStop(1, '#96FED1');
						fColor = grd;
					} else fColor = '#96FED1';
					sColor = '#1AFD9C';
					break;
				case 'class obstacle':
					type = 'class';
					if (status.opt === 3) {
						let pos = new Vec2(editObjectSpace.x * (i + 0.5), editObjectSpace.y * 0.5);
						let grd = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 1.5 * w);
						grd.addColorStop(0, constant.editFrame['obstacle'].fColor);
						grd.addColorStop(1, '#FF9797');
						fColor = grd;
					} else fColor = '#FF9797';
					sColor = '#FF5151';
					break;
				case 'class special':
					type = 'class';
					if (status.opt === 4) {
						let pos = new Vec2(editObjectSpace.x * (i + 0.5), editObjectSpace.y * 0.5);
						let grd = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 1.5 * w);
						grd.addColorStop(0, constant.editFrame['special'].fColor);
						grd.addColorStop(1, '#FFE66F');
						fColor = grd;
					} else fColor = '#FFE66F';
					sColor = '#FFDC35';
					break;
				case 'spikedBlock':
					o = new GameObject.spikedBlock(new Vec2(editObjectSpace.x * (i + 0.5), editObjectSpace.y * 0.5));
					type = 'obstacle';
					break;
				case 'platform':
					o = new GameObject.platform(new Vec2(editObjectSpace.x * (i + 0.5), editObjectSpace.y * 0.5));
					type = 'platform';
					break;
				case 'bow':
					o = new GameObject.bow(new Vec2(editObjectSpace.x * (i + 0.5), editObjectSpace.y * 0.5 + 3));
					type = 'obstacle';
					break;
				case 'movingPlatform':
					o = new GameObject.movingPlatform(new Vec2(editObjectSpace.x * (i + 0.5), editObjectSpace.y * 0.5 + 10));
					type = 'platform';
					break;
				case 'mucus':
					o = new GameObject.mucus(new Vec2(editObjectSpace.x * (i + 0.5), editObjectSpace.y * 0.5));
					type = 'covering';
					break;
				case 'cymbal':
					o = new GameObject.cymbal(new Vec2(editObjectSpace.x * (i + 0.5), editObjectSpace.y * 0.5));
					type = 'obstacle';
					break;
				case 'ice':
					o = new GameObject.ice(new Vec2(editObjectSpace.x * (i + 0.5), editObjectSpace.y * 0.5));
					type = 'covering';
					break;
				case 'conveyor':
					o = new GameObject.conveyor(new Vec2(editObjectSpace.x * (i + 0.5), editObjectSpace.y * 0.5));
					type = 'covering';
					break;
				case 'portal':
					o = new GameObject.portal(new Vec2(editObjectSpace.x * (i + 0.5), editObjectSpace.y * 0.5));
					type = 'special';
					break;
				case 'trapPlatform':
					o = new GameObject.trapPlatform(new Vec2(editObjectSpace.x * (i + 0.5), editObjectSpace.y * 0.5));
					type = 'platform';
					break;
				case 'missileBase':
					o = new GameObject.missileBase(new Vec2(editObjectSpace.x * (i + 0.5), editObjectSpace.y * 0.5));
					type = 'obstacle';
					break;
				case 'lockedWall':
					o = new GameObject.lockedWall(new Vec2(editObjectSpace.x * (i + 0.5), editObjectSpace.y * 0.5));
					type = 'special';
					break;
				case 'unlocker':
					o = new GameObject.unlocker(new Vec2(editObjectSpace.x * (i + 0.5), editObjectSpace.y * 0.5));
					type = 'special';
					break;
				case 'block':
					o = new GameObject.block(new Vec2(editObjectSpace.x * (i + 0.5), editObjectSpace.y * 0.5));
					type = 'obstacle';
					break;
				case 'movingPlatform_oblique':
					o = new GameObject.movingPlatform_oblique(new Vec2(editObjectSpace.x * (i + 0.5) - 10, editObjectSpace.y * 0.5 + 10));
					type = 'platform';
					break;
				case 'movingPlatform_rect':
					o = new GameObject.movingPlatform_rect(new Vec2(editObjectSpace.x * (i + 0.5) - 10, editObjectSpace.y * 0.5 + 10));
					type = 'platform';
					break;
				case 'woodenBox':
					o = new GameObject.woodenBox(new Vec2(editObjectSpace.x * (i + 0.5), editObjectSpace.y * 0.5));
					type = 'obstacle';
					break;
				case 'magnet':
					o = new GameObject.magnet(new Vec2(editObjectSpace.x * (i + 0.5), editObjectSpace.y * 0.5));
					type = 'special';
					break;
				case 'brokenPlatform':
					o = new GameObject.brokenPlatform(new Vec2(editObjectSpace.x * (i + 0.5), editObjectSpace.y * 0.5));
					type = 'platform';
					break;
				case 'deathTotem':
					o = new GameObject.deathTotem(new Vec2(editObjectSpace.x * (i + 0.5), editObjectSpace.y * 0.5));
					type = 'covering';
					break;
			}
		}
		ctx.beginPath();
		ctx.rect(0 + editObjectSpace.x * i + 3, 3, editObjectSpace.x - 6, editObjectSpace.y - 6);
		ctx.fillStyle = (type === 'class') ? fColor : constant.editFrame[type].fColor;
		ctx.fill();
		ctx.lineWidth = 2;
		ctx.strokeStyle = (type === 'class') ? sColor : constant.editFrame[type].sColor;
		ctx.stroke();
		ctx.lineWidth = 1;
		ctx.closePath();

		if (i === 0) {
			ctx.save();
			ctx.translate(editObjectSpace.x * 0.5, editObjectSpace.y * 0.5);
			if (status.active) api.drawStopKey(ctx, w);
			else api.drawPlayKey(ctx, w);
			ctx.restore();
		} else if (i === 15) {
			ctx.save();
			ctx.translate(editObjectSpace.x * 15.5, editObjectSpace.y * 0.5);
			api.drawTrashCan(ctx, w);
			ctx.restore();
        }
		if (o) o.draw(ctx);
		if (objectList[i - 1] === 'class platform') {
			let o1 = new GameObject.trapPlatform(new Vec2(editObjectSpace.x * (i + 0.5) - 8, editObjectSpace.y * 0.5 - 8));
			o1.draw(ctx);
			let o2 = new GameObject.platform(new Vec2(editObjectSpace.x * (i + 0.5) + 8, editObjectSpace.y * 0.5 - 0));
			o2.draw(ctx);
			ctx.textAlign = "center";
			ctx.textBaseline = 'middle';
			ctx.font = "15px italic";
			ctx.strokeStyle = 'white';
			ctx.lineWidth = 2;
			ctx.strokeText("平台類", editObjectSpace.x * (i + 0.5), editObjectSpace.y * 0.5 + 20);
			ctx.fillStyle = 'black';
			ctx.fillText("平台類", editObjectSpace.x * (i + 0.5), editObjectSpace.y * 0.5 + 20);
		} else if (objectList[i - 1] === 'class covering') {
			let o1 = new GameObject.mucus(new Vec2(editObjectSpace.x * (i + 0.5) - 10, editObjectSpace.y * 0.5 - 10));
			o1.draw(ctx);
			let o2 = new GameObject.conveyor(new Vec2(editObjectSpace.x * (i + 0.5) + 10, editObjectSpace.y * 0.5 - 5));
			o2.draw(ctx);
			let o3 = new GameObject.ice(new Vec2(editObjectSpace.x * (i + 0.5), editObjectSpace.y * 0.5 + 3));
			o3.draw(ctx);
			ctx.textAlign = "center";
			ctx.textBaseline = 'middle';
			ctx.font = "15px italic";
			ctx.strokeStyle = 'white';
			ctx.lineWidth = 2;
			ctx.strokeText("覆蓋類", editObjectSpace.x * (i + 0.5), editObjectSpace.y * 0.5 + 20);
			ctx.fillStyle = 'black';
			ctx.fillText("覆蓋類", editObjectSpace.x * (i + 0.5), editObjectSpace.y * 0.5 + 20);
		} else if (objectList[i - 1] === 'class obstacle') {
			let o1 = new GameObject.spikedBlock(new Vec2(editObjectSpace.x * (i + 0.5) - 3, editObjectSpace.y * 0.5 - 6));
			ctx.save();
			ctx.translate(o1.pos.x, o1.pos.y);
			ctx.scale(0.7, 0.7);
			ctx.translate(-o1.pos.x, -o1.pos.y);
			o1.draw(ctx);
			ctx.restore();
			let o2 = new GameObject.bow(new Vec2(editObjectSpace.x * (i + 0.5) - 3, editObjectSpace.y * 0.5 + 12));
			ctx.save();
			ctx.translate(o1.pos.x, o1.pos.y);
			ctx.rotate(- 0.36 * Math.PI);
			ctx.translate(-o1.pos.x, -o1.pos.y);
			o2.draw(ctx);
			ctx.restore();
			ctx.textAlign = "center";
			ctx.textBaseline = 'middle';
			ctx.font = "15px italic";
			ctx.strokeStyle = 'white';
			ctx.lineWidth = 2;
			ctx.strokeText("障礙類", editObjectSpace.x * (i + 0.5), editObjectSpace.y * 0.5 + 20);
			ctx.fillStyle = 'black';
			ctx.fillText("障礙類", editObjectSpace.x * (i + 0.5), editObjectSpace.y * 0.5 + 20);
		} else if (objectList[i - 1] === 'class special') {
			let o1 = new GameObject.portal(new Vec2(editObjectSpace.x * (i + 0.5) - 2, editObjectSpace.y * 0.5 - 7));
			o1.index = 1;
			o1.open = true;
			o1.draw(ctx);
			let o2 = new GameObject.unlocker(new Vec2(editObjectSpace.x * (i + 0.5) + 10, editObjectSpace.y * 0.5));
			o2.draw(ctx);
			ctx.textAlign = "center";
			ctx.textBaseline = 'middle';
			ctx.font = '15px  sans-serif';
			ctx.strokeStyle = 'white';
			ctx.strokeText("特殊類", editObjectSpace.x * (i + 0.5), editObjectSpace.y * 0.5 + 20);
			ctx.fillStyle = 'black';
			ctx.fillText("特殊類", editObjectSpace.x * (i + 0.5), editObjectSpace.y * 0.5 + 20);
		}
    }
	ctx.restore();

	/* 繪製手中的物件 */
	if (status.clear) {
		ctx.save();
		ctx.translate(status.holdObject.pos.x, status.holdObject.pos.y);
		api.drawTrashCan(ctx, 0.5 * w);
		ctx.restore();
	} else {
		if (status.holding || status.hold) {
			status.holdObject.draw(ctx);
		}
    }


	/* 繪製訊息 */
	if (status.message.text !== '') {
		ctx.save();

		let messageCycle = ((Date.now() - status.message.lastPost) / 3000);
		messageCycle = (messageCycle < 0.05) ? messageCycle / 0.05 :
					   (messageCycle > 0.9) ? Math.max((1 - messageCycle), 0) / 0.1: 1 ;
		ctx.globalAlpha = messageCycle;

		ctx.translate(constant.mapStart.x, constant.mapStart.y);
		ctx.globalAlpha *= 0.2;

		ctx.beginPath();
		ctx.rect(constant.mapSize.x * w * 0.3, 0, constant.mapSize.x * w * 0.4, w);
		ctx.fillStyle = 'white';
		ctx.fill();
		ctx.closePath();

		ctx.globalAlpha *= 5;
		ctx.textAlign = "center";
		ctx.textBaseline = 'middle';
		ctx.font = "15px italic";
		ctx.lineWidth = 2;
		ctx.fillStyle = (status.message.color) ? status.message.color: 'red';
		ctx.fillText(status.message.text, constant.mapSize.x * w * 0.5, 0.5 * w);

		ctx.restore();
    }
}

export default Drawer;