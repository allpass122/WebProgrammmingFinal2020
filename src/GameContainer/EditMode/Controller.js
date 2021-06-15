import Vec2 from '../Class/Vec2';
import spikedBlock from '../Class/GameObject';

export default function Controller(scene, status, setStatus, setting) {
	const mouseMoveHandler = (e) => {
		if (!status.hold && status.selecting && e.offsetX >= 88 && e.offsetX < 1112 && e.offsetY >= 44 && e.offsetY < 556) {
			let newStatus = { ...status };
			let selectGridPos = new Vec2(~~((e.offsetX - 88) / 32), ~~((e.offsetY - 44) / 32));
			newStatus.selectPair[1] = selectGridPos;
			setStatus(newStatus);
        } else if (status.hold) {
			let newStatus = { ...status };
			newStatus.holdObject.pos = new Vec2(e.offsetX, e.offsetY);
			setStatus(newStatus);
		}
	};

	const mouseDownHandler = (e) => {
		if (e.button === 0) {
			if (e.offsetX >= 88 && e.offsetX < 1112 && e.offsetY >= 44 && e.offsetY < 556) {
				if (status.hold) {
					let newStatus = { ...status };
					newStatus.hold = false;
					let newSpikedBlock = new spikedBlock(status.holdObject.pos);
					newSpikedBlock.setPerspective(true);
					setting.objects.push(newSpikedBlock);
					newStatus.holdObject = null;
					setStatus(newStatus);
				} else {
					let newStatus = { ...status };
					newStatus.select = true;
					newStatus.selecting = true;
					let selectGridPos = new Vec2(~~((e.offsetX - 88) / 32), ~~((e.offsetY - 44) / 32));
					newStatus.selectPair = [selectGridPos, selectGridPos];
					setStatus(newStatus);
                }
			} else {
				let newStatus = { ...status };
				newStatus.select = false;
				newStatus.selecting = false;
				setStatus(newStatus);
				if (e.offsetX >= 88 && e.offsetX < 1112 && e.offsetY >= 560 && e.offsetY < 688) {
					let newStatus = { ...status };
					let objectIndex = ~~((e.offsetX - 88) / 128);
					switch (objectIndex) {
						case 0:
							newStatus.hold = true;
							newStatus.holdObject = new spikedBlock(new Vec2(e.offsetX, e.offsetY));
							newStatus.holdObject.setPerspective(true);
							break;
					}
					setStatus(newStatus);
                }
            }
        }
	}

	const mouseUpHandler = (e) => {
		if (status.select && e.button === 0 && e.offsetX >= 88 && e.offsetX < 1112 && e.offsetY >= 44 && e.offsetY < 556) {
			let newStatus = { ...status };
			newStatus.selecting = false;
			let selectGridPos = new Vec2(~~((e.offsetX - 88) / 32), ~~((e.offsetY - 44) / 32));
			newStatus.selectPair[1] = selectGridPos;
			setStatus(newStatus);
		} else {
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