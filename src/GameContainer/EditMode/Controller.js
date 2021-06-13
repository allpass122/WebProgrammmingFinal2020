import Vec2 from '../Class/Vec2';

export default function Controller(scene, event, setEvent, setting) {
	const mouseMoveHandler = (e) => {
		event.mousePos = new Vec2(e.offsetX, e.offsetY);
	};

	const clickHandler = (e) => {
		if (e.offsetX >= 88 && e.offsetX < 1112 && e.offsetY >= 44 && e.offsetY < 556) {
			setEvent({ select: true, selectList: [new Vec2(~~((e.offsetX - 88) / 32), ~~((e.offsetY - 44) / 32))] });
		} else {
			if (event.select) setEvent({ select: false, selectList: [] });
		}
	};

	scene.addEventListener('mousemove', mouseMoveHandler);
	scene.addEventListener('click', clickHandler);

	return () => {
		scene.removeEventListener('mousemove', mouseMoveHandler);
		scene.removeEventListener('click', clickHandler);
	};
};