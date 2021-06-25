import * as api from './Drawer';
import constant from './constant';
import { useRef, useEffect } from 'react';

const Preview = (props) => {
    const canvasRef = useRef();
    let setting = props.setting;

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        ctx.scale(0.1, 0.1);
        api.drawMap(ctx, setting.map);

        for (let i = 0; i < constant.maxLayer; i++) {
            for (let j = 0; j < setting.objects.length; j++) {
                if (setting.objects[j].layer.status[i]) setting.objects[j].draw(ctx, i);
            }
        }
    });

    return (<canvas ref={canvasRef} width={`102.4px`} height={`51.2px`}></canvas>);
}

export default Preview;