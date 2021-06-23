import React, { useRef, useEffect, useState } from 'react';
import DrawMap from './Drawer';
import Engine from '../EditMode/Engine';
import Controller from './Controller';
import { initState, updateState } from './state'

import CONSTANT from './PlayModeConstant'
import Player from './Object/player'

import "./PlayMode.css"


const PlayMapCreater = (props) => {
    const { setting } = props
    // const { mapSize, map, objects } = setting
    let canvasRef = useRef();

    const [status, setStatus] = useState({
        me: new Player(1, 'name', 0, 0),
        startTime: Date.now(),
        endTime: Date.now(),
        gameState: 'playing',
	    pressDown: false, 
        pressRight: false, 
        pressLeft: false, 
        pressUp: false
    });

    useEffect(() => {
        if (status.gameState === CONSTANT.GameOver  || status.gameState === CONSTANT.WIN) {
            console.log('Time', Date.now() - status.startTime)
            openForm()
        }
    }, [status])

    function closeForm() {
        document.getElementById("gameForm").style.display = "none";
        setStatus(() => ({ ...status, gameState: 'playing' }))
    }
    function openForm() {
        document.getElementById("gameForm").style.display = "block";
    }



    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        ctx.restore()
        ctx.save()
        ctx.translate(CONSTANT.translate.x, CONSTANT.translate.y);
        ctx.scale(CONSTANT.scale.w, CONSTANT.scale.h);
        initState(status, setting)

        let cancelController;
        let requestId;

        cancelController = Controller(canvas, status, setStatus, setting);
        let fps, fpsInterval, startTime, now, then, elapsed;

        function update() {
            requestId = requestAnimationFrame(update);
            updateState(status, setting, setStatus)

            now = Date.now();
            elapsed = now - then;
            if (elapsed > fpsInterval) {
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

        if (status.gameState !== 'playing')
            cancelAnimationFrame(requestId)

        return () => {
            cancelController();
            cancelAnimationFrame(requestId);
        };
    }, [setStatus, status, setting]);

    function toTimeFormate(ms) {
        return `${Math.floor(ms / 1000 / 60).toString().padStart(2, "0")} : ${Math.floor(ms / 1000 % 60).toString().padStart(2, "0")}`
    }

    return (
        <>
            <div>
                <canvas ref={canvasRef} id='PlayModeCanvas' width={CONSTANT.CanvasWidth} height={CONSTANT.CanvasHeight}
                    style={{ position: "absolute", left: 150, top: 60, zIndex: 0 }} ></canvas>
            </div>

            <div className="form-popup" id="gameForm">
                <label >
                    <span>{status.gameState}</span>
                    <span>{toTimeFormate(status.endTime - status.startTime)}</span>
                </label>
                <button className='gameButton' onClick={closeForm}>Try Again</button>
            </div>
            {/* <button className='typeButton' onClick={closeForm}>CLOSE</button>
            <button className='typeButton' onClick={openForm}>OPEN</button> */}
        </>
    )

}

export default PlayMapCreater;
