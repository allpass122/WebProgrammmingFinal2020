import {clear, drawMap} from '../GameContainer/Drawer'
import Vec2 from '../GameContainer/Class/Vec2';
import constant from '../GameContainer/constant';
import CONSTANT from './PlayModeConstant';

// import { getCurrentState } from './state';


function Drawer(ctx, setting, status) {
	let map = setting.map;
	let objects = setting.objects;
	let me = status.me.serializeForUpdate()

	/* �M�ŵe�� */
	clear(ctx);

	/* ø�s�a�� */
	ctx.save();
	ctx.translate(constant.mapStart.x, constant.mapStart.y); 
	const w = constant.gridWidth;
	drawMap(ctx, map);

	ctx.restore();

	/* ø�s���� */
	for (let i = 0; i < objects.length; i++) {
		objects[i].draw(ctx);
	}

	if (status.hold) {
		status.holdObject.draw(ctx);
    }

	drawPlayer(ctx, me, me)
	ctx.restore();

}

// Renders a player at the given coordinates
function drawPlayer(context, me, player) {
	const { x, y } = player;
	const canvasX = CONSTANT.CanvasWidth / 2 + x - me.x;
	const canvasY = CONSTANT.CanvasHeight / 2 + y - me.y;
  
	context.save();
	context.translate(x, y);
	context.fillStyle = CONSTANT.PlayerColor;
	context.beginPath();
	context.arc(0, 0, 8, 0, 2 * Math.PI);
	context.fill();
	context.restore();
  }


export default Drawer;