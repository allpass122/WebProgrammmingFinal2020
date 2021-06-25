import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef, } from 'react';
import DrawMap from './Drawer';
import Engine from '../EditMode/Engine';
import Controller from './Controller';
import { initState, updateState } from './state'
import { getAsset, getAssetNames, downloadAssets } from './assets';
import { enpackage, unpackage, show } from "../DataPackager";


import CONSTANT from './PlayModeConstant'
import Player from './Object/player'

import "./PlayMode.css"


const PlayMapCreater = (props) => {
    // let { setting } = props
    const [setting, setSetting] = useState(props.setting)
    const [loading, setLoading] = useState(false);
    useEffect( async () => {
        downloadAssets().then( setLoading(true) )
    })
    // const { mapSize, map, objects } = setting
    let canvasRef = useRef();
    // const [head, setHead] = useState('seal.svg')
    const defaultState = {
        me: new Player(1, 'name', 0, 0),
        startTime: Date.now(),
        endTime: Date.now(),
        playTime: 0,
        gameState: 'start',
        head: 'seal.svg',
        pressDown: false,
        pressRight: false,
        pressLeft: false,
        pressUp: false
    }

    const [status, setStatus] = useState(defaultState);


    useEffect(() => {
        if (
            status.gameState === CONSTANT.GameOver ||
            status.gameState === CONSTANT.WIN
        ) {

            props.challenge(
                status.endTime - status.startTime,
                status.gameState === CONSTANT.WIN
            );
            openForm("gameForm");
            setSetting( ()=> unpackage(enpackage(setting)) )
        }
    }, [status]);


    function closeForm(form) {
        document.getElementById(form).style.display = "none";
        setStatus(() => ({ ...defaultState, head: status.head , gameState: 'playing' }))
    }

    function openForm(form) {
        document.getElementById(form).style.display = "block";
    }

    useEffect(() => {
        if (!loading) return

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        ctx.restore()
        ctx.save()
        ctx.scale(CONSTANT.scale.w, CONSTANT.scale.h);
        ctx.translate(CONSTANT.translate.x, CONSTANT.translate.y);
        
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

        // if (status.gameState !== 'playing')
        //     cancelAnimationFrame(requestId)
        if (status.gameState === CONSTANT.GameOver || status.gameState === 'start'){
            cancelController()
        }
        if (status.gameState === 'start')
            openForm("startForm")

        if ( !(status.gameState === 'start' || status.gameState === 'playing'))
            cancelAnimationFrame(requestId);

        return () => {
            cancelController();
            cancelAnimationFrame(requestId);
        };
    }, [setStatus, status, setting, loading]);

    function toTimeFormate(ms) {
        return `${Math.floor(ms / 1000 / 60)
            .toString()
            .padStart(2, "0")} : ${Math.floor((ms / 1000) % 60)
                .toString()
                .padStart(2, "0")}`;
    }

    const getImg = async (assetName) => {
        console.log( assetName)
         const img = await getAsset(assetName)
        return <img src={img.src}/>
    }


    return (
        <>
            <div>
                <canvas ref={canvasRef} id='PlayModeCanvas'
                    width={CONSTANT.CanvasWidth}
                    height={CONSTANT.CanvasHeight}
                    style={{ position: "absolute", left: CONSTANT.canvasLeft, top: CONSTANT.canvasTop, zIndex: 0 }} ></canvas>
            </div>
            {/* Game Over form */}
            <div className="form-popup" id="gameForm">
                <span>{status.gameState}</span>
                <span>{toTimeFormate(status.playTime)}</span>
                <button className='gameButton' onClick={() => { closeForm("gameForm") }}>Try Again</button>
            </div>
            {/* select player form */}
            <div className="form-popup" id="startForm">
                <span>Choose A Player</span>
                <div onChange={ (e)=>{ status.head = e.target.value}}>
                    { (loading) ?
                    getAssetNames().map((assetName) => (
                        <label>
                            <input type="radio" name="test" value={assetName} />
                            <img src={getAsset(assetName).src}/>
                        </label>
                    )) : <></>}
                </div>
                <button className='gameButton' onClick={() => { closeForm("startForm") }}>Start</button>
            </div>

            {/* <button className='typeButton' onClick={closeForm}>CLOSE</button>
            <button className='typeButton' onClick={openForm}>OPEN</button> */}
        </>
    )
}



export default PlayMapCreater;
