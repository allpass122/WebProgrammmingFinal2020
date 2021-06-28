import {clear, drawMap} from '../Drawer'
import constant from '../constant';
import {CONSTANT} from './PlayModeConstant'
import { getAsset } from './assets';

let FOCUS_PLAYER = true
let PLAY_MODE = true

function Drawer(ctx, setting, status) {
	let map = setting.map;
	let objects = setting.objects;
	let me = status.me.serializeForUpdate()
	const w = constant.gridWidth

	/* �M�ŵe�� */
	clear(ctx);

	
	ctx.restore()
	ctx.save()

	// draw background
	ctx.fillStyle = constant.blockColor
	ctx.fillRect(0, -100, constant.mapSize.x*w*2, constant.mapSize.y*w*2);

	if (status.FOCUS_PLAYER) {
		ctx.scale(CONSTANT.scale.w, CONSTANT.scale.h);
		ctx.translate(CONSTANT.translate.x, CONSTANT.translate.y);        
	} else {
		// playmode whole view
		ctx.scale(1.2, 1.2);
		ctx.translate(-80, 30);	
	}
	
	/* ø�s�a�� */
	ctx.save();
	ctx.translate(constant.mapStart.x, constant.mapStart.y); 
	focusPlayer(ctx, me, status)
	drawMap(ctx, map, PLAY_MODE);
	ctx.restore();

	/* ø�s���� */
	ctx.save();
	focusPlayer(ctx, me, status)
	for (let i = 0; i < constant.maxLayer; i++) {
		// 2 < player layer < 3
		if (i === 3) drawPlayer(ctx, me, me, status.head)
		for (let j = 0; j < objects.length; j++) {
			if (objects[j].layer.top() === i) objects[j].draw(ctx);
		}
	}
	ctx.restore();
	
}

function focusPlayer(context, me, status) {
	if (!status.FOCUS_PLAYER) return
	const w = constant.gridWidth
	let focusX =  0*constant.mapStart.x + constant.mapSize.x*w/2 - me.x
	let focusY =  0*constant.mapStart.y + constant.mapSize.y*w/2 - me.y
	context.translate(focusX, focusY); 
}

// Renders a player at the given coordinates
function drawPlayer(context, me, player, head = 'seal.svg') {
	const { x, y } = me;
	const w = constant.gridWidth
  
	context.save();
	context.translate(x, y);

	// context.globalAlpha = 0.5
	context.drawImage(
		getAsset(head),
		-CONSTANT.PlayerR,
		-CONSTANT.PlayerR,
		CONSTANT.PlayerR * 2,
		CONSTANT.PlayerR * 2,
	  );
  
	context.restore();
  }

export default Drawer;