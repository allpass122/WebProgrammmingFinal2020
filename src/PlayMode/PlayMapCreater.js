import React, { useRef, useEffect, useState} from 'react';
import DrawMap from './Drawer';
import Engine from '../GameContainer/EditMode/Engine'; 
import Vec2 from '../GameContainer/Class/Vec2';
import Controller from './Controller';
import {initState, updateState} from './state'


// import {initState, processGameUpdate} from './state'
import CONSTANT from './PlayModeConstant'
import Player from './Object/player'


export const PlayMapCreater = (props) => {
    const { setting } = props
    const { mapSize, map, objects } = setting
    let canvasRef = useRef();
    let playerRef = useRef();	

    const [status, setStatus] = useState({
		mousePos: new Vec2(),
		select: false,
		selecting: false,
		selectPair: [new Vec2(), new Vec2()],
		hold: false,
		holdObject: null,
        me: new Player(1,'name', 0, 0), 
        startTime: Date.now(),
        lastUpdateTime: Date.now(),
        gameState: 'playing'
	});

	let cancelController;
	let requestId;
    let requestId2;

	useEffect(() => {
        if (status.gameState == CONSTANT.GameOver) console.log(status.gameState)

		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');

		cancelController = Controller(canvas, status, setStatus, setting);
        let fps, fpsInterval, startTime, now, then, elapsed;

		let renderCount = 0
        ctx.restore()
        ctx.save()
        ctx.translate(CONSTANT.translate.x, CONSTANT.translate.y);    
        ctx.scale(CONSTANT.scale.w,CONSTANT.scale.h);
        initState(status, setting) 

        
		function update()  {
			requestId = requestAnimationFrame(update);
            updateState(status, setting, setStatus)
			
            now = Date.now();
            elapsed = now - then;
            if (elapsed > fpsInterval) {
                if (renderCount++ % 100 === 0) console.log(renderCount)
                then = now - (elapsed % fpsInterval);
    			Engine(setting.objects);
                DrawMap(ctx, setting, status);
            }
		};

        // initialize the timer variables and start the animation
        function startAnimating(fps) {
            fpsInterval = 1000 / fps;
            then = Date.now();
            startTime = then;
            update();
        }
        startAnimating(30)
        // initState()
        // processGameUpdate()

		return () => {
			cancelController();
			cancelAnimationFrame(requestId);
		};
	}, [setStatus, status, setting]);


    return (
        <>
        {/* <div>
            <canvas ref={playerRef} id='PlayModeCanvas'  width={CONSTANT.CanvasWidth}  height={CONSTANT.CanvasHeight} 
            style={{position: "absolute", left: 0, top: 50, zIndex: 0}}></canvas>
        </div> */}

        <div>
            <canvas ref={canvasRef} id='PlayModeCanvas'  width={CONSTANT.CanvasWidth}  height={CONSTANT.CanvasHeight} 
            style={{position: "absolute", left: 0, top: 100, zIndex: 0}}></canvas>
        </div>
        </>
    )

}

