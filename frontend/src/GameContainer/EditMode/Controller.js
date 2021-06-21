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
			/* ���ϥΪ̨S���ޱ�����ɨåB���b��ܮ�l���ɭԡA�b�a�ϪŶ����Y�ɧ�s��ܽd�� */
			let newStatus = { ...status };
			let selectGridPos = mousePos.sub(mapStart).toGrid(w);
			newStatus.selectPair[1] = selectGridPos;
			setStatus(newStatus);
		} else if (status.holding) {
			/* ���ϥΪ̥��b�ޱ�����ɡA��s�����l��ƹ���l */
			let newStatus = { ...status };
			if (mousePos.between(mapStart, mapEnd)) {
				/* ����b�a�Ϥ��ɥ����Y�ɮե���l */
				newStatus.holdObject.pos = mousePos.sub(mapStart).toGrid(w).mul(w).add(mapStart.add(new Vec2(0.5 * w, 0.5 * w)));
			} else newStatus.holdObject.pos = mousePos.clone();
			setStatus(newStatus);
		}
	};

	const mouseDownHandler = (e) => {
		const mousePos = new Vec2(e.offsetX, e.offsetY);
		if (e.button === 0) {
			if (mousePos.between(mapStart, mapEnd)) {
				/* �b�a�Ϥ����U�ƹ����� */
				if (status.holding) {
					/* ���է⪫���b�a�ϤW */
					let newStatus = { ...status };
					newStatus.holding = status.ctrl;
					if (status.holdObject.place(setting.map, setting.objects)) {
						setting.objects.push(status.holdObject);
					}
					newStatus.holdObject = (status.ctrl) ? status.holdObject.clone() : null;
					setStatus(newStatus);
				} else {
					/* �p�G�S���b�ޱ�����h�}�l��ܮ�l�άO����b�a�ϤW������ */
					let newStatus = { ...status };
					let gridPos = mousePos.sub(mapStart).toGrid(w);
					let topLayer = setting.map[gridPos.y][gridPos.x].layer.top();
					if (topLayer !== -1) { // �N���������|�b��l�W(�u���B�z����ޱ�)
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
				/* �����I��a�ϥ~�h�N�@�����A�Ѱ�(�I�쪫��s��w�ҥ~) */
				let newStatus = { ...status };
				newStatus.select = false;
				newStatus.selecting = false;
				newStatus.holding = false;
				newStatus.hold = false;
				newStatus.holdObject = null;
				setStatus(newStatus);
				if (mousePos.between(new Vec2(88, 560), new Vec2(1112, 688))) {
					/* �b����s��w���I���h��o�@�ӷs����i��ޱ� */
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
			/* �b���b��ܪ����A�U��}����T�w��ܮ�l���d���Ѱ����b��ܪ����A */
			let newStatus = { ...status };
			newStatus.selecting = false;
			let selectGridPos = mousePos.sub(mapStart).toGrid(w);
			newStatus.selectPair[1] = selectGridPos;
			setStatus(newStatus);
		} else {
			/* �_�h�b�����L���p�������Ѱ����/���b��ܪ����A */
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