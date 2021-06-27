import {clear, drawMap} from '../Drawer'
import constant from '../constant';
import {CONSTANT} from './PlayModeConstant'
import { getAsset } from './assets';

let FOCUS_PLAYER = true

function Drawer(ctx, setting, status) {
	let map = setting.map;
	let objects = setting.objects;
	let me = status.me.serializeForUpdate()
	const w = constant.gridWidth

	/* �M�ŵe�� */
	clear(ctx);

	// draw background
	ctx.fillStyle = constant.blockColor
	ctx.fillRect(0, 0, constant.mapSize.x*w, constant.mapSize.y*w);

	/* ø�s�a�� */
	ctx.save();
	ctx.translate(constant.mapStart.x, constant.mapStart.y); 
	focusPlayer(ctx, me)
	drawMap(ctx, map, true);
	ctx.restore();

	/* ø�s���� */
	ctx.save();
	focusPlayer(ctx, me)
	for (let i = 0; i < constant.maxLayer; i++) {
		for (let j = 0; j < objects.length; j++) {
			if (objects[j].layer.top() === i) objects[j].draw(ctx);
		}
	}
	ctx.restore();
	
	drawPlayer(ctx, me, me, status.head)
}

function focusPlayer(context, me) {
	if (!FOCUS_PLAYER) return
	const w = constant.gridWidth
	let focusX =  0*constant.mapStart.x + constant.mapSize.x*w/2 - me.x
	let focusY =  0*constant.mapStart.y + constant.mapSize.y*w/2 - me.y
	context.translate(focusX, focusY); 
}

// Renders a player at the given coordinates
function drawPlayer(context, me, player, head = 'seal.svg') {
	const { x, y } = me;
	const w = constant.gridWidth
	// const canvasX = CONSTANT.CanvasWidth / 2 + x - me.x;
	// const canvasY = CONSTANT.CanvasHeight / 2 + y - me.y;
  
	context.save();
	focusPlayer(context, me)
	context.translate(x, y);
	context.drawImage(
		getAsset(head),
		-CONSTANT.PlayerR,
		-CONSTANT.PlayerR,
		CONSTANT.PlayerR * 2,
		CONSTANT.PlayerR * 2,
	  );

	// context.fillStyle = CONSTANT.PlayerColor;
	// context.beginPath();
	// context.arc(0, 0, CONSTANT.PlayerR, 0, 2 * Math.PI);
	// context.fill();
	context.restore();
  }


export default Drawer;