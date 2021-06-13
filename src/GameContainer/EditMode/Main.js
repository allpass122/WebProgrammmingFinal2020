import React, { useState , useEffect , useRef } from 'react';
import Drawer from './Drawer';
import Controller from './Controller';
import Vec2 from '../Class/Vec2';

function EditGameMode(props) {
	let canvasRef = useRef();	
	let setting = props.setting;
	const [event, setEvent] = useState({
		mousePos: new Vec2(),
		select: false,
		selectList: []
	});

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');

		let cancelController;
		cancelController = Controller(canvas, event, setEvent, setting);

		let requestId;
		const update = () => {
			/* 每一楨(fps = 60)進行的更新 */
			Drawer(ctx, setting, event);

			requestId = requestAnimationFrame(update);
		};
		update();

		return () => {
			cancelController();
			cancelAnimationFrame(requestId);
		};
	}, [event, setting]);

	return (
		<>
			<div>
				<canvas id='EditModeCanvas' ref={canvasRef} width={`${props.width}`} height={`${props.height}`}></canvas>
			</div>
			<div id='EditModeParameters'>
				{(event.select)? (
					<>
						<button class='typeButton' onClick={() => {setting.map[event.selectList[0].y][event.selectList[0].x] = 'none' }}>None</button>
						<button class='typeButton' onClick={() => {setting.map[event.selectList[0].y][event.selectList[0].x] = 'block' }}>Block</button>
						<button class='typeButton' onClick={() => {setting.map[event.selectList[0].y][event.selectList[0].x] = 'none start' }}>Start</button>
						<button class='typeButton' onClick={() => {setting.map[event.selectList[0].y][event.selectList[0].x] = 'none end' }}>End</button>
					</>): <div></div>
				}
			</div>
		</>
	);
}

export default EditGameMode;

