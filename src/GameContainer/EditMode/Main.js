import React, { useState , useEffect , useRef } from 'react';
import Drawer from './Drawer';
import Controller from './Controller';
import Vec2 from '../Class/Vec2';
import Layer from '../Class/Layer';
import constant from '../constant';

function EditGameMode(props) {
	let canvasRef = useRef();
	let setting = props.setting;
	/* 
	 select: �ثe�O�_����l�Q���
	 selecting: �ثe�O�_���b��ܮ�l
	 selectPair: �Q��ܪ��h�Ӯ�l����ӹ﨤����l
	 hold: �ثe�O�_������Q�ޱ�
	 holdObject: �Q�ޱ�������
	 holdDetail: �Q�ޱ�������Ӹ`�C��
	*/
	const [status, setStatus] = useState({
		select: false,
		selecting: false,
		selectPair: [new Vec2(), new Vec2()],
		hold: false,
		holdObject: null,
		holdDetail: {},
	});

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');

		let cancelController;
		cancelController = Controller(canvas, status, setStatus, setting);

		let requestId;
		const update = () => {
			/* �C�@��(fps = 60)�i�檺��s */
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
		['none', 'None'], ['block', 'Block'], ['none start', 'Start'], ['none end', 'End'], ['none dead', 'Dead'], ['none ice', 'Ice'], ['none muddy', 'Muddy']
	];

	return (
		<>
			<div>
				<canvas id='EditModeCanvas' ref={canvasRef} width={`${props.width}`} height={`${props.height}`}></canvas>
			</div>
			<div id='EditModeParameters'>
				{(status.select) ? (
					<div>
						{typeButtonPairs.map(pair => <button className='typeButton' onClick={() => { changeSelectedGridsType(pair[0]); }}>{pair[1]}</button>)}
					</div>) : <div></div>
				}
				{(status.hold) ? (
					<div>
						{Object.keys(status.holdDetail).map(p =>
							<input type="text" className='parametersInput' value={status.holdObject.detail[p]} onChange={(e) => {
								let newStatus = { ...status };
								let newDetail = { ...status.holdObject.detail }
								newDetail[p] = e.target.value;
								newStatus.holdObject.detail = newDetail;
								setStatus(newStatus);
							}} />)}
					</div>) : <div></div>
				}
			</div>
		</>
	);
}

export default EditGameMode;
