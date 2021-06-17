import Vec2 from '../Class/Vec2';
import spikedBlock from '../Class/GameObject';
import constant from '../constant';

export default function Controller(scene, status, setStatus, setting) {
	const mapStart = constant.mapStart;
	const mapEnd = constant.mapStart.add(constant.mapSize.mul(constant.gridWidth));
	const w = constant.gridWidth;

	const mouseMoveHandler = (e) => {
		const mousePos = new Vec2(e.offsetX, e.offsetY);
		if (!status.hold && status.selecting && mousePos.between(mapStart, mapEnd)) {
			/* 當使用者沒有操控物件時並且正在選擇格子的時候，在地圖空間內即時更新選擇範圍 */
			let newStatus = { ...status };
			let selectGridPos = mousePos.sub(mapStart).toGrid(w);
			newStatus.selectPair[1] = selectGridPos;
			setStatus(newStatus);
		} else if (status.hold) {
			/* 當使用者正在操控物件時，更新物件位子到滑鼠位子 */
			let newStatus = { ...status };
			if (mousePos.between(mapStart, mapEnd)) {
				/* 物件在地圖內時必須即時校正位子 */
				newStatus.holdObject.pos = mousePos.sub(mapStart).toGrid(w).mul(w).add(mapStart.add(new Vec2(0.5 * w, 0.5 * w)));
			} else newStatus.holdObject.pos = mousePos.clone();
			setStatus(newStatus);
		}
	};

	const mouseDownHandler = (e) => {
		const mousePos = new Vec2(e.offsetX, e.offsetY);
		if (e.button === 0) {
			if (mousePos.between(mapStart, mapEnd)) {
				/* 在地圖內按下滑鼠左鍵 */
				if (status.hold) {
					/* 嘗試把物件放在地圖上 */
					let newStatus = { ...status };
					newStatus.hold = false;
					if (status.holdObject.place(setting.map)) {
						setting.objects.push(status.holdObject);
					}
					newStatus.holdObject = null;
					setStatus(newStatus);
				} else {
					/* 如果沒有在操控物件則開始選擇格子或是選取在地圖上的物件 */
					let newStatus = { ...status };
					let gridPos = mousePos.sub(mapStart).toGrid(32);
					let topLayer = setting.map[gridPos.y][gridPos.x].layer.top();
					if (topLayer != -1) { // 代表有物件疊在格子上(優先處理物件操控)
						for (let i = 0; i < setting.objects.length; i++) {
							if (setting.objects[i].pos.sub(mapStart).toGrid(w).equal(gridPos) && setting.objects[i].layer.top() === topLayer) {
								newStatus.hold = true;
								newStatus.select = false;
								newStatus.selecting = false;
								setting.objects[i].remove(setting.map);
								newStatus.holdObject = setting.objects[i];
								newStatus.holdDetail = setting.objects[i].detailFunction();
								setting.objects.splice(i, 1);
								break;
                            }
                        }
					} else {
						newStatus.select = true;
						newStatus.selecting = true;
						newStatus.selectPair = [gridPos, gridPos];
					}
					setStatus(newStatus);
                }
			} else {
				/* 左鍵點到地圖外則將一切狀態解除(點到物件編輯庫例外) */
				let newStatus = { ...status };
				newStatus.select = false;
				newStatus.selecting = false;
				newStatus.hold = false;
				newStatus.holdObject = null;
				setStatus(newStatus);
				if (mousePos.between(new Vec2(88, 560), new Vec2(1112, 688))) {
					/* 在物件編輯庫內點擊則獲得一個新物件進行操控 */
					let objectIndex = ~~((e.offsetX - 88) / 128);
					switch (objectIndex) {
						case 0:
							newStatus.hold = true;
							newStatus.holdObject = new spikedBlock(new Vec2(e.offsetX, e.offsetY));
							newStatus.holdDetail = newStatus.holdObject.detailFunction();
							newStatus.holdObject.setPerspective(true);
							break;
					}
					setStatus(newStatus);
                }
            }
        }
	}

	const mouseUpHandler = (e) => {
		const mousePos = new Vec2(e.offsetX, e.offsetY);
		if (e.button === 0 && status.select && status.selecting && mousePos.between(mapStart, mapEnd)) {
			/* 在正在選擇的狀態下放開左鍵確定選擇格子的範圍後解除正在選擇的狀態 */
			let newStatus = { ...status };
			newStatus.selecting = false;
			let selectGridPos = mousePos.sub(mapStart).toGrid(w);
			newStatus.selectPair[1] = selectGridPos;
			setStatus(newStatus);
		} else {
			/* 否則在任何其他狀況都直接解除選擇/正在選擇的狀態 */
			let newStatus = { ...status };
			newStatus.select = false;
			newStatus.selecting = false;
			setStatus(newStatus);
		}
	}

	scene.addEventListener('mousemove', mouseMoveHandler);
	scene.addEventListener('mousedown', mouseDownHandler);
	scene.addEventListener('mouseup', mouseUpHandler);

	return () => {
		scene.removeEventListener('mousemove', mouseMoveHandler);
		scene.removeEventListener('mousedown', mouseDownHandler);
		scene.removeEventListener('mouseup', mouseUpHandler);
	};
};