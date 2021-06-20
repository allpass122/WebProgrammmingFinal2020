import React, { useState, useEffect, useRef } from 'react';
import Drawer from './Drawer';
import Engine from './Engine';
import Controller from './Controller';
import Vec2 from '../Class/Vec2';
import constant from '../constant';

import {PlayMapCreater} from '../../PlayMode/PlayMapCreater'

function EditGameMode(props) {
	const canvasRef = useRef();
	const setting = props.setting;
	/* 
	 select: 目前是否有格子被選擇
	 selecting: 目前是否正在選擇格子
	 selectPair: 被選擇的多個格子中兩個對角的位子
	 hold: 目前是否有物件被操控
	 holdObject: 被操控的物件
	 holdDetail: 被操控的物件細節列表
	*/
	const [status, setStatus] = useState({
		select: false,
		selecting: false,
		selectPair: [new Vec2(), new Vec2()],
		hold: false,
		holdObject: null,
		holdDetail: {},
	});
	let cancelController;
	let requestId;


	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');

		cancelController = Controller(canvas, status, setStatus, setting);

		let renderCount = 0
		const update = () => {
			/* 嚙瘠嚙瑾嚙踝蕭(fps = 60)嚙箠嚙賣的嚙踝蕭s */
			Drawer(ctx, setting, status);
			Engine(setting.objects);

			requestId = requestAnimationFrame(update);
			if (renderCount++ % 100 === 0) console.log(renderCount)
		};
		update();

		return () => {
			cancelController();
			cancelAnimationFrame(requestId);
		};
	}, [setStatus, status, setting]);

	/* 改變被選擇的格子屬性 */
	const changeSelectedGridsType = (newType) => {
		if (!status.select) return;
		let luPos = Vec2.leftUp(status.selectPair[0], status.selectPair[1]);
		let rdPos = Vec2.rightDown(status.selectPair[0], status.selectPair[1]);
		let range = rdPos.sub(luPos).add(new Vec2(1, 1));

		for (let i = 0; i < range.x; i++) {
			for (let j = 0; j < range.y; j++) {
				if (setting.map[luPos.y + j][luPos.x + i].layer.isOverlap(constant.typeLayerPairs[newType])) return;
			}
		}
		for (let i = 0; i < range.x; i++) {
			for (let j = 0; j < range.y; j++) {
				setting.map[luPos.y + j][luPos.x + i].type = newType;
			}
		}
	};

	/* 格子屬性列表 */
	const typeButtonPairs = [
		['none', 'None'], ['block', 'Block'], ['start', 'Start'], ['end', 'End'], ['dead', 'Dead'], ['ice', 'Ice'], ['muddy', 'Muddy']
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
				<button className='save' onClick={() => props.save(setting)}>save</button>
				{(status.select) ? (
					<div>
						{typeButtonPairs.map(pair => <button className='typeButton' onClick={() => { changeSelectedGridsType(pair[0]); }}>{pair[1]}</button>)}
					</div>) : <div></div>
				}
				{(status.hold) ? (
					<div>
						{Object.keys(status.holdDetail).map(p => {
							switch (status.holdDetail[p].type) {
								case 'text':
									return (<input type="text" className='parametersInput' value={status.holdObject.detail[p]} onChange={(e) => {
										let newStatus = { ...status };
										let newDetail = { ...status.holdObject.detail }
										newDetail[p] = e.target.value;
										newStatus.holdObject.detail = newDetail;
										setStatus(newStatus);
									}} />);
									break;
								case 'select':
									return (<select className='parametersSelect' value={status.holdObject.detail[p]} onChange={(e) => {
										let newStatus = { ...status };
										let newDetail = { ...status.holdObject.detail };
										newDetail[p] = e.target.value;
										newStatus.holdObject.detail = newDetail;
										setStatus(newStatus);
									}} >
										{status.holdDetail[p].options.map(o => <option value={o}>{o}</option>)}
									</select>);
									break;
								case 'int':
									return (<input type="text" className='parametersInput' value={status.holdObject.detail[p]} onChange={(e) => {
										let newStatus = { ...status };
										let newDetail = { ...status.holdObject.detail }
										let newValue = ~~e.target.value;
										newDetail[p] = (newValue < status.holdDetail[p].min) ? status.holdDetail[p].min :
													   (newValue > status.holdDetail[p].max) ? status.holdDetail[p].max : newValue;
										newStatus.holdObject.detail = newDetail;
										setStatus(newStatus);
									}} />);
									break;
							}
						})}
					</div>) : <div></div>
				}
			</div></> }
		</>
	);
}

export default EditGameMode;

