import Vec2 from '../Class/Vec2';
import * as GameObject from '../Class/GameObject';
import constant from '../constant';

export default function Controller(scene, status, setStatus, setting, reset) {
	const mapStart = constant.mapStart;
	const mapEnd = constant.mapStart.add(constant.mapSize.mul(constant.gridWidth));
	const w = constant.gridWidth;
	const copyable = (e, object) => {
		return (e.ctrlKey && object.type !== 'portal' && object.type !== 'lockedWall' && object.type !== 'unlocker' && object.type !== 'woodenBox')
	};

	const mouseMoveHandler = (e) => {
		const mousePos = new Vec2(e.offsetX, e.offsetY);
		if (!status.holding && status.selecting && mousePos.between(mapStart, mapEnd)) {
			/* 當使用者沒有操控物件時並且正在選擇格子的時候，在地圖空間內即時更新選擇範圍 */
			let selectGridPos = mousePos.sub(mapStart).toGrid(w);
			status.selectPair[1] = selectGridPos;
		} else if (status.holding) {
			/* 當使用者正在操控物件時，更新物件位子到滑鼠位子 */
			if (mousePos.between(mapStart, mapEnd) && !status.clear) {
				/* 物件在地圖內時必須即時校正位子 */
				status.holdObject.pos = mousePos.sub(mapStart).toGrid(w).mul(w).add(mapStart.add(new Vec2(0.5 * w, 0.5 * w)));
			} else status.holdObject.pos = mousePos.clone();
		}
	};

	const mouseDownHandler = (e) => {
		const mousePos = new Vec2(e.offsetX, e.offsetY);
		if (e.button === 0) {
			if (mousePos.between(mapStart, mapEnd)) {
				console.log(status.clear);
				if (status.clear) {
					let gridPos = mousePos.sub(mapStart).toGrid(w);
					let topLayer = setting.map[gridPos.y][gridPos.x].layer.top();
					if (topLayer !== -1) { // 代表有物件疊在格子上(處理物件清除)
						for (let i = 0; i < setting.objects.length; i++) {
							if (setting.objects[i].gridPos.equal(gridPos)) {
								if (e.ctrlKey || setting.objects[i].layer.top() === topLayer) {
									setting.objects[i].remove(setting.map, setting.objects);
									setting.objects.splice(i--, 1);
								} 
							}
						}
					}
				} else {
					/* 在地圖內按下滑鼠左鍵 */
					if (status.holding) {
						status.holdObject.pos = mousePos.sub(mapStart).toGrid(w).mul(w).add(mapStart.add(new Vec2(0.5 * w, 0.5 * w)));
						/* 嘗試把物件放在地圖上 */
						let newStatus = { ...status };
						if (e.ctrlKey && !copyable(e, status.holdObject)) {
							newStatus.message = { text: '這個物件無法被複製', lastPost: Date.now() };
						}
						newStatus.holding = copyable(e, status.holdObject);
						if (status.holdObject.place(setting.map, setting.objects)) {
							setting.objects.push(status.holdObject);
						} else {
							newStatus.message = { text: '這個格子已經被其他同種的物件佔據', lastPost: Date.now() };
						}
						newStatus.holdObject = (copyable(e, status.holdObject)) ? status.holdObject.clone() : null;
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
									if (e.ctrlKey && !copyable(e, setting.objects[i])) {
										newStatus.message = { text: '這個物件無法被複製', lastPost: Date.now() };
									}
									if (!copyable(e, setting.objects[i])) setting.objects[i].remove(setting.map, setting.objects);
									newStatus.holdObject = (copyable(e, setting.objects[i])) ? setting.objects[i].clone() : setting.objects[i];
									newStatus.holdObject.pos = mousePos.sub(mapStart).toGrid(w).mul(w).add(mapStart.add(new Vec2(0.5 * w, 0.5 * w)));
									newStatus.holdDetail = setting.objects[i].detailFunction();
									if (!copyable(e, setting.objects[i])) setting.objects.splice(i, 1);
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
				}
			} else {
				/* 左鍵點到地圖外則將一切狀態解除(點到物件編輯庫例外) */
				let newStatus = { ...status };
				newStatus.select = false;
				newStatus.selecting = false;
				newStatus.holding = false;
				newStatus.hold = false;
				newStatus.holdObject = null;
				newStatus.clear = false;
				setStatus(newStatus);
				if (mousePos.between(new Vec2(88, 516), new Vec2(1112, 580))) {
					/* 在物件編輯庫內點擊則獲得一個新物件進行操控 */
					let objectIndex = ~~((e.offsetX - 88) / 64);
					let result = '';
					if (objectIndex === 0) result = 'stoporplay';
					else if (objectIndex === 15) result = 'clear';
					else {
						const objectList = [];
						objectList.push('class platform');
						if (status.opt === 1) objectList.push(...constant.editObjectList.platform);
						objectList.push('class covering');
						if (status.opt === 2) objectList.push(...constant.editObjectList.covering);
						objectList.push('class obstacle');
						if (status.opt === 3) objectList.push(...constant.editObjectList.obstacle);
						objectList.push('class special');
						if (status.opt === 4) objectList.push(...constant.editObjectList.special);
						result = (objectList[objectIndex - 1]) ? objectList[objectIndex - 1] : '';
					}
					let count = 0;
					switch (result) {
						case 'stoporplay':
							newStatus.clear = false;
							newStatus.active = !newStatus.active;
							if (newStatus.active) {
								newStatus.message = { text: '建議在靜止狀態下編輯物件', lastPost: Date.now(), color: 'green'};
                            }
							reset();
							break;
						case 'clear':
							newStatus.clear = !newStatus.clear;
							if (newStatus.clear) {
								newStatus.message = { text: '注意！你現在處於清除物件的狀態', lastPost: Date.now(), color: 'green' };
								newStatus.holding = true;
								newStatus.holdObject = { type: 'trashCan', pos: new Vec2(e.offsetX, e.offsetY)};
								newStatus.holdDetail = {};
                            }
							break;
						case 'class platform':
							newStatus.opt = (status.opt === 1) ? 0 : 1;
							break;
						case 'class covering':
							newStatus.opt = (status.opt === 2) ? 0 : 2;
							break;
						case 'class obstacle':
							newStatus.opt = (status.opt === 3) ? 0 :  3;
							break;
						case 'class special':
							newStatus.opt = (status.opt === 4) ? 0 : 4;
							break;
						case 'spikedBlock':
							newStatus.holding = true;
							newStatus.holdObject = new GameObject.spikedBlock(new Vec2(e.offsetX, e.offsetY));
							newStatus.holdDetail = newStatus.holdObject.detailFunction();
							newStatus.holdObject.setPerspective(true);
							break;
						case 'platform':
							newStatus.holding = true;
							newStatus.holdObject = new GameObject.platform(new Vec2(e.offsetX, e.offsetY));
							newStatus.holdDetail = newStatus.holdObject.detailFunction();
							newStatus.holdObject.setPerspective(true);
							break;
						case 'bow':
							newStatus.holding = true;
							newStatus.holdObject = new GameObject.bow(new Vec2(e.offsetX, e.offsetY));
							newStatus.holdDetail = newStatus.holdObject.detailFunction();
							newStatus.holdObject.setPerspective(true);
							break;
						case 'movingPlatform':
							newStatus.holding = true;
							newStatus.holdObject = new GameObject.movingPlatform(new Vec2(e.offsetX, e.offsetY));
							newStatus.holdDetail = newStatus.holdObject.detailFunction();
							newStatus.holdObject.setPerspective(true);
							break;
						case 'mucus':
							newStatus.holding = true;
							newStatus.holdObject = new GameObject.mucus(new Vec2(e.offsetX, e.offsetY));
							newStatus.holdDetail = newStatus.holdObject.detailFunction();
							newStatus.holdObject.setPerspective(true);
							break;
						case 'cymbal':
							newStatus.holding = true;
							newStatus.holdObject = new GameObject.cymbal(new Vec2(e.offsetX, e.offsetY));
							newStatus.holdDetail = newStatus.holdObject.detailFunction();
							newStatus.holdObject.setPerspective(true);
							break;
						case 'ice':
							newStatus.holding = true;
							newStatus.holdObject = new GameObject.ice(new Vec2(e.offsetX, e.offsetY));
							newStatus.holdDetail = newStatus.holdObject.detailFunction();
							newStatus.holdObject.setPerspective(true);
							break;
						case 'conveyor':
							newStatus.holding = true;
							newStatus.holdObject = new GameObject.conveyor(new Vec2(e.offsetX, e.offsetY));
							newStatus.holdDetail = newStatus.holdObject.detailFunction();
							newStatus.holdObject.setPerspective(true);
							break;
						case 'portal':
							count = 0;
							for (let i = 0; i < setting.objects.length; i++) {
								if (setting.objects[i].type === 'portal') count++;
							}
							if (count < 16) {
								newStatus.holding = true;
								newStatus.holdObject = new GameObject.portal(new Vec2(e.offsetX, e.offsetY));
								newStatus.holdDetail = newStatus.holdObject.detailFunction();
								newStatus.holdObject.setPerspective(true);
							} else {
								newStatus.holding = false;
								newStatus.message = { text: '傳送門最多只能放置 16 個', lastPost: Date.now() };
                            }
							break;
						case 'trapPlatform':
							newStatus.holding = true;
							newStatus.holdObject = new GameObject.trapPlatform(new Vec2(e.offsetX, e.offsetY));
							newStatus.holdDetail = newStatus.holdObject.detailFunction();
							newStatus.holdObject.setPerspective(true);
							break;
						case 'missileBase':
							newStatus.holding = true;
							newStatus.holdObject = new GameObject.missileBase(new Vec2(e.offsetX, e.offsetY));
							newStatus.holdDetail = newStatus.holdObject.detailFunction();
							newStatus.holdObject.setPerspective(true);
							break;
						case 'lockedWall':
							count = 0;
							for (let i = 0; i < setting.objects.length; i++) {
								if (setting.objects[i].type === 'lockedWall') count++;
							}
							if (count < 8) {
								newStatus.holding = true;
								newStatus.holdObject = new GameObject.lockedWall(new Vec2(e.offsetX, e.offsetY));
								newStatus.holdDetail = newStatus.holdObject.detailFunction();
								newStatus.holdObject.setPerspective(true);
							} else {
								newStatus.holding = false;
								newStatus.message = { text: '上鎖的牆最多只能放置 8 個', lastPost: Date.now() };
                            }
							break;
						case 'unlocker':
							count = 0;
							for (let i = 0; i < setting.objects.length; i++) {
								if (setting.objects[i].type === 'unlocker') count++;
							}
							if (count < 8) {
								newStatus.holding = true;
								newStatus.holdObject = new GameObject.unlocker(new Vec2(e.offsetX, e.offsetY));
								newStatus.holdDetail = newStatus.holdObject.detailFunction();
								newStatus.holdObject.setPerspective(true);
							} else {
								newStatus.holding = false;
								newStatus.message = { text: '鑰匙最多只能放置 8 個', lastPost: Date.now() };
                            }
							break;
						case 'block':
							newStatus.holding = true;
							newStatus.holdObject = new GameObject.block(new Vec2(e.offsetX, e.offsetY));
							newStatus.holdDetail = newStatus.holdObject.detailFunction();
							newStatus.holdObject.setPerspective(true);
							break; 
						case 'movingPlatform_oblique':
							newStatus.holding = true;
							newStatus.holdObject = new GameObject.movingPlatform_oblique(new Vec2(e.offsetX, e.offsetY));
							newStatus.holdDetail = newStatus.holdObject.detailFunction();
							newStatus.holdObject.setPerspective(true);
							break;
						case 'movingPlatform_rect':
							newStatus.holding = true;
							newStatus.holdObject = new GameObject.movingPlatform_rect(new Vec2(e.offsetX, e.offsetY));
							newStatus.holdDetail = newStatus.holdObject.detailFunction();
							newStatus.holdObject.setPerspective(true);
							break;
						case 'woodenBox':
							count = 0;
							for (let i = 0; i < setting.objects.length; i++) {
								if (setting.objects[i].type === 'woodenBox') count++;
							}
							if (count < 16) {
								newStatus.holding = true;
								newStatus.holdObject = new GameObject.woodenBox(new Vec2(e.offsetX, e.offsetY));
								newStatus.holdDetail = newStatus.holdObject.detailFunction();
								newStatus.holdObject.setPerspective(true);
							} else {
								newStatus.holding = false;
								newStatus.message = { text: '木箱最多只能放置 16 個', lastPost: Date.now() };
							}
							break;
						case 'magnet':
							newStatus.holding = true;
							newStatus.holdObject = new GameObject.magnet(new Vec2(e.offsetX, e.offsetY));
							newStatus.holdDetail = newStatus.holdObject.detailFunction();
							newStatus.holdObject.setPerspective(true);
							break;
						case 'brokenPlatform':
							newStatus.holding = true;
							newStatus.holdObject = new GameObject.brokenPlatform(new Vec2(e.offsetX, e.offsetY));
							newStatus.holdDetail = newStatus.holdObject.detailFunction();
							newStatus.holdObject.setPerspective(true);
							break;
						case 'deathTotem':
							newStatus.holding = true;
							newStatus.holdObject = new GameObject.deathTotem(new Vec2(e.offsetX, e.offsetY));
							newStatus.holdDetail = newStatus.holdObject.detailFunction();
							newStatus.holdObject.setPerspective(true);
							break;
						default:
							break;
					}
					if (result !== 'clear') newStatus.clear = false;
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

	const stopContextMenu = (e) => {
		e.preventDefault();
	};

	scene.addEventListener('mousemove', mouseMoveHandler);
	scene.addEventListener('mousedown', mouseDownHandler);
	scene.addEventListener('mouseup', mouseUpHandler);
	scene.addEventListener('contextmenu', stopContextMenu);

	return () => {
		scene.removeEventListener('mousemove', mouseMoveHandler);
		scene.removeEventListener('mousedown', mouseDownHandler);
		scene.removeEventListener('mouseup', mouseUpHandler);
		scene.removeEventListener('contextmenu', stopContextMenu);
	};
};