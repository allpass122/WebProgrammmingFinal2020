import React, { useState , useEffect , useRef } from 'react';
import Drawer from './Drawer';
import Controller from './Controller';
import Vec2 from '../Class/Vec2';

import {PlayMapCreater} from '../../PlayMode/PlayMapCreater'

function EditGameMode(props) {
	let canvasRef = useRef();	
	let setting = props.setting;
	const [status, setStatus] = useState({
		mousePos: new Vec2(),
		select: false,
		selecting: false,
		selectPair: [new Vec2(), new Vec2()],
		hold: false,
		holdObject: null,
	});
	let cancelController;
	let requestId;


	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');

		cancelController = Controller(canvas, status, setStatus, setting);

		let renderCount = 0
		const update = () => {
			/* �C�@��(fps = 60)�i�檺��s */
			Drawer(ctx, setting, status);
			requestId = requestAnimationFrame(update);
			if (renderCount++ % 100 === 0) console.log(renderCount)
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
				setting.map[luPos.y + j][luPos.x + i].type = newType;
			}
		}
	};

	const typeButtonPairs = [
		['none', 'None'], ['block', 'Block'], ['none start', 'Start'], ['none end', 'End'], ['none dead', 'Dead'], ['none ice', 'Ice'], ['none muddy', 'Muddy']
	];


	const [Playing, setPlaying] = useState(false)
	const saveSetting = () => {
		cancelController();
		cancelAnimationFrame(requestId);
		setPlaying(true)
	}
	const startEdit = () => {
		setStatus(() => ({...status}) )
		setPlaying(false)

	}

	return (
		<>
		{(Playing) ? 
		<button className='typeButton' onClick={startEdit}>Edit</button>
		: <button className='typeButton' onClick={saveSetting}>Play</button>
		}
		{(Playing) ? 
		<>
		<PlayMapCreater setting={setting}/>
		</>
		: 
			<><div>
				<canvas id='EditModeCanvas' ref={canvasRef} width={`${props.width}`} height={`${props.height}`}></canvas>
			</div>
			<div id='EditModeParameters'>
				{(status.select) ? (
					<div>
						{typeButtonPairs.map(pair => <button class='typeButton' onClick={() => { changeSelectedGridsType(pair[0]); }}>{pair[1]}</button>)}
					</div>) : <div></div>
				}
				{(status.hold) ? (
					<div>
						{Object.keys(status.holdObject.detail).map(key =>
							<input type="text" className='parametersInput' placeholder={key} onChange={(e) => { status.holdObject.detail[key] = e.target.value }} />)}
					</div>) : <div></div>
				}
			</div></> }
		</>
	);
}

export default EditGameMode;

