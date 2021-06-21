import Vec2 from '../Class/Vec2';
import * as GameObject from '../Class/GameObject';
import constant from '../constant';

export default function Controller(scene, status, setStatus, setting) {
	const mapStart = constant.mapStart;
	const mapEnd = constant.mapStart.add(constant.mapSize.mul(constant.gridWidth));
	const w = constant.gridWidth;

	const mouseMoveHandler = (e) => {
		const mousePos = new Vec2(e.offsetX, e.offsetY);
		if (!status.holding && status.selecting && mousePos.between(mapStart, mapEnd)) {
			/* 當使用者沒有操控物件時並且正在選擇格子的時候，在地圖空間內即時更新選擇範圍 */
			let newStatus = { ...status };
			let selectGridPos = mousePos.sub(mapStart).toGrid(w);
			newStatus.selectPair[1] = selectGridPos;
			setStatus(newStatus);
		} else if (status.holding) {
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
				if (status.holding) {
					/* 嘗試把物件放在地圖上 */
					let newStatus = { ...status };
					newStatus.holding = status.ctrl;
					if (status.holdObject.place(setting.map, setting.objects)) {
						setting.objects.push(status.holdObject);
					}
					newStatus.holdObject = (status.ctrl) ? status.holdObject.clone() : null;
					setStatus(newStatus);
				} else {
					/* 如果沒有在操控物件則開始選擇格子或是選取在地圖上的物件 */
					let newStatus = { ...status };
					let gridPos = mousePos.sub(mapStart).toGrid(w);
					let topLayer = setting.map[gridPos.y][gridPos.x].layer.top();
					if (topLayer !== -1) { // 代表有物件疊在格子上(優先處理物件操控)
						for (let i = 0; i < setting.objects.length; i++) {
							if (setting.objects[i].gridPos.equal(gridPos) && setting.objects[i].layer.top() === topLayer) {
								newStatus.holding = true;
								newStatus.hold = false;
								newStatus.select = false;
								newStatus.selecting = false;
								if (!status.ctrl) setting.objects[i].remove(setting.map, setting.objects);
								newStatus.holdObject = (status.ctrl) ? setting.objects[i].clone() : setting.objects[i];
								newStatus.holdObject.pos = mousePos.clone();
								newStatus.holdDetail = setting.objects[i].detailFunction();
								if (!status.ctrl) setting.objects.splice(i, 1);
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
				newStatus.holding = false;
				newStatus.hold = false;
				newStatus.holdObject = null;
				setStatus(newStatus);
				if (mousePos.between(new Vec2(88, 560), new Vec2(1112, 688))) {
					/* 在物件編輯庫內點擊則獲得一個新物件進行操控 */
					let objectIndex = ~~((e.offsetX - 88) / 128);
					switch (objectIndex) {
						case 0:
							newStatus.holding = true;
							newStatus.holdObject = new GameObject.spikedBlock(new Vec2(e.offsetX, e.offsetY));
							newStatus.holdDetail = newStatus.holdObject.detailFunction();
							newStatus.holdObject.setPerspective(true);
							break;
						case 1:
							newStatus.holding = true;
							newStatus.holdObject = new GameObject.platform(new Vec2(e.offsetX, e.offsetY));
							newStatus.holdDetail = newStatus.holdObject.detailFunction();
							newStatus.holdObject.setPerspective(true);
							break;
						case 2:
							newStatus.holding = true;
							newStatus.holdObject = new GameObject.bow(new Vec2(e.offsetX, e.offsetY));
							newStatus.holdDetail = newStatus.holdObject.detailFunction();
							newStatus.holdObject.setPerspective(true);
							break;
						case 3:
							newStatus.holding = true;
							newStatus.holdObject = new GameObject.movingPlatform(new Vec2(e.offsetX, e.offsetY));
							newStatus.holdDetail = newStatus.holdObject.detailFunction();
							newStatus.holdObject.setPerspective(true);
							break;
						case 4:
							newStatus.holding = true;
							newStatus.holdObject = new GameObject.mucus(new Vec2(e.offsetX, e.offsetY));
							newStatus.holdDetail = newStatus.holdObject.detailFunction();
							newStatus.holdObject.setPerspective(true);
							break;
						default:
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

	const keyDownHandler = (e) => {
		if (e.keyCode === 17) {
			status.ctrl = true;
        }
	};

	const keyUpHandler = (e) => {
		if (e.keyCode === 17) {
			status.ctrl = false;
		}
	};

	const stopContextMenu = (e) => {
		e.preventDefault();
	};

	scene.addEventListener('mousemove', mouseMoveHandler);
	scene.addEventListener('mousedown', mouseDownHandler);
	scene.addEventListener('mouseup', mouseUpHandler);
	window.addEventListener('keydown', keyDownHandler);
	window.addEventListener('keyup', keyUpHandler);
	scene.addEventListener('contextmenu', stopContextMenu);

	return () => {
		scene.removeEventListener('mousemove', mouseMoveHandler);
		scene.removeEventListener('mousedown', mouseDownHandler);
		scene.removeEventListener('mouseup', mouseUpHandler);
		window.removeEventListener('keydown', keyDownHandler);
		window.removeEventListener('keyup', keyUpHandler);
		scene.removeEventListener('contextmenu', stopContextMenu);
	};
};