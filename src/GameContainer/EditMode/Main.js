import React, { useState , useEffect , useRef } from 'react';
import Drawer from './Drawer';
import Controller from './Controller';
import Vec2 from '../Class/Vec2';

function EditGameMode(props) {
	let canvasRef = useRef();	
	let setting = props.setting;
	const [status, setStatus] = useState({
		mousePos: new Vec2(),
		select: false,
		selectPair: [new Vec2(), new Vec2()],
		hold: false,
		holdObject: null
	});
	const [aaa, setAAA] = useState("");

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');

		let cancelController;
		cancelController = Controller(canvas, status, setStatus, setting);

		let requestId;
		const update = () => {
			/* 每一楨(fps = 60)進行的更新 */
			Drawer(ctx, setting, status);
			console.log(status.select)
			requestId = requestAnimationFrame(update);
		};
		update();

		return () => {
			cancelController();
			cancelAnimationFrame(requestId);
		};
	}, [setStatus, status, setting]);

	const leftUpPos = (p1, p2) => (new Vec2(Math.min(p1.x, p2.x), Math.min(p1.y, p2.y)));
	const RightDownPos = (p1, p2) => (new Vec2(Math.max(p1.x, p2.x), Math.max(p1.y, p2.y)));

	const changeSelectedGridsType = (newType) => {
		if (!status.select) return;
		let luPos = leftUpPos(status.selectPair[0], status.selectPair[1]);
		let rdPos = RightDownPos(status.selectPair[0], status.selectPair[1]);
		let range = rdPos.sub(luPos).add(new Vec2(1, 1));

		for (let i = 0; i < range.x; i++) {
			for (let j = 0; j < range.y; j++) {
				setting.map[luPos.y + j][luPos.x + i] = newType;
            }
		}
	};

	return (
		<>
			<div>
				<canvas id='EditModeCanvas' ref={canvasRef} width={`${props.width}`} height={`${props.height}`}></canvas>
			</div>
			<div id='EditModeParameters'>
				{(status.select) ? (
					<>
						<button class='typeButton' onClick={() => { changeSelectedGridsType('none'); }}>None</button>
						<button class='typeButton' onClick={() => { changeSelectedGridsType('block'); }}>Block</button>
						<button class='typeButton' onClick={() => { changeSelectedGridsType('none start'); }}>Start</button>
						<button class='typeButton' onClick={() => { changeSelectedGridsType('none end'); }}>End</button>
					</>): <div></div>
				}
			</div>
		</>
	);
}

export default EditGameMode;

