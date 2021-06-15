import Vec2 from '../Class/Vec2';

export default function Controller(scene, status, setStatus, setting) {
	const mouseMoveHandler = (e) => {
		if (status.hold) {
			status.mousePos = new Vec2(e.offsetX, e.offsetY);
		}
	};

	const mouseDownHandler = (e) => {
		if (e.button === 0 && e.offsetX >= 88 && e.offsetX < 1112 && e.offsetY >= 44 && e.offsetY < 556) {
			let newStatus = status;
			newStatus.select = true;
			let selectGridPos = new Vec2(~~((e.offsetX - 88) / 32), ~~((e.offsetY - 44) / 32));
			newStatus.selectPair = [selectGridPos, selectGridPos];
			setStatus(newStatus);
		} else {
			let newStatus = status;
			newStatus.select = false;
			setStatus(newStatus);
        }
	}

	const mouseUpHandler = (e) => {
		if (status.select && e.button === 0 && e.offsetX >= 88 && e.offsetX < 1112 && e.offsetY >= 44 && e.offsetY < 556) {
			let newStatus = status;
			let selectGridPos = new Vec2(~~((e.offsetX - 88) / 32), ~~((e.offsetY - 44) / 32));
			newStatus.selectPair[1] = selectGridPos;
			setStatus(newStatus);
		} else {
			let newStatus = status;
			newStatus.select = false;
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