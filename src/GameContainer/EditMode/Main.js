import React, { useState, useEffect, useRef } from 'react';
import Drawer from './Drawer';
import Engine from './Engine';
import Controller from './Controller';
import Vec2 from '../Class/Vec2';
import constant from '../constant';

import {PlayMapCreater} from '../PlayMode/PlayMapCreater'

function EditGameMode(props) {
	const canvasRef = useRef();
	const setting = props.setting;
	/* 
	 select: �ثe�O�_����l�Q���
	 selecting: �ثe�O�_���b��ܮ�l
	 selectPair: �Q��ܪ��h�Ӯ�l����ӹ﨤����l
	 hold: �ثe�O�_������Q�ޱ�(�Ƚվ�Ѽ�)
	 holding: �ثe�O�_�����󥿦b�Q�ޱ�(���ʨåB�վ�Ѽ�)
	 holdObject: �Q�ޱ�������
	 holdDetail: �Q�ޱ�������Ӹ`�C��
	*/
	const [status, setStatus] = useState({
		select: false,
		selecting: false,
		selectPair: [new Vec2(), new Vec2()],
		hold: false,
		holding: false,
		holdObject: null,
		holdDetail: {},
	});
	let cancelController;
	let requestId;


	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');

		cancelController = Controller(canvas, status, setStatus, setting);

		const update = () => {
			/* �C�@��(fps = 60)�i�檺��s */
			Engine(setting.objects);
			Drawer(ctx, setting, status);

			requestId = requestAnimationFrame(update);
		};
		update();

		return () => {
			cancelController();
			cancelAnimationFrame(requestId);
		};
	}, [setStatus, status, setting]);

	/* ���ܳQ��ܪ���l�ݩ� */
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

	/* ��l�ݩʦC�� */
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
				{(status.holding || status.hold) ? (
					<div>
						{Object.keys(status.holdDetail).map(p => {
							switch (status.holdDetail[p].type) {
								case 'text':
									return (<input key={p} type="text" className='parametersInput' value={status.holdObject.detail[p]} onChange={(e) => {
										let newStatus = { ...status };
										let newDetail = { ...status.holdObject.detail }
										newDetail[p] = e.target.value;
										newStatus.holdObject.detail = newDetail;
										setStatus(newStatus);
									}} />);
								case 'select':
									return (<select key={p} className='parametersSelect' value={status.holdObject.detail[p]} onChange={(e) => {
										let newStatus = { ...status };
										let newDetail = { ...status.holdObject.detail };
										newDetail[p] = e.target.value;
										newStatus.holdObject.detail = newDetail;
										setStatus(newStatus);
									}} >
										{status.holdDetail[p].options.map(o => <option key={o} value={o}>{o}</option>)}
									</select>);
								case 'int':
									return (<input key={p} type="text" className='parametersInput' placeholder={status.holdObject.detail[p]} onKeyUp={(e) => {
										if (e.key === 'Enter') {
											e.preventDefault();
											let newStatus = { ...status };
											let newDetail = { ...status.holdObject.detail }
											let newValue = ~~e.target.value;
											newDetail[p] = (newValue < status.holdDetail[p].min) ? status.holdDetail[p].min :
														   (newValue > status.holdDetail[p].max) ? status.holdDetail[p].max : newValue;
											e.target.value = newDetail[p];
											newStatus.holdObject.detail = newDetail;
											setStatus(newStatus);
										}
									}} />);
								case 'check':
									return (<div key={`div_${p}`}>
										<input key={`input_${p}`} type="checkbox" className='parametersCheck' checked={status.holdObject.detail[p]} onChange={(e) => {
											let newStatus = { ...status };
											let newDetail = { ...status.holdObject.detail }
											newDetail[p] = e.target.checked;
											newStatus.holdObject.detail = newDetail;
											setStatus(newStatus);
										}} /> <label key={`label_${p}`}>{p}</label>
									</div>);
								default:
									return (<div></div>);
							}
						})}
					</div>) : <div></div>
				}
			</div></> }
		</>
	);
}

export default EditGameMode;

