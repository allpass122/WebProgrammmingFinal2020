import React, { useState, useEffect, useRef } from "react";
import Drawer from "./Drawer";
import Engine from "./Engine";
import Controller from "./Controller";
import Vec2 from "../Class/Vec2";
import constant from "../constant";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import SaveIcon from "@material-ui/icons/Save";
import Modal from "@material-ui/core/Modal";

function EditGameMode(props) {
    const canvasRef = useRef();
    const divRef = useRef();
    const setting = props.setting;
    const [open, setOpen] = useState(false);

    /* 
       select: �ثe�O�_����l�Q���
       selecting: �ثe�O�_���b��ܮ�l
       selectPair: �Q��ܪ��h�Ӯ�l����ӹ﨤����l
       hold: �ثe�O�_������Q�ޱ�(�Ƚվ�Ѽ�)
       holding: �ثe�O�_�����󥿦b�Q�ޱ�(���ʨåB�վ�Ѽ�)
       holdObject: �Q�ޱ�������
       holdDetail: �Q�ޱ�������Ӹ`�C��
       ctrl: ctrl��O�_�Q���U
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

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        let cancelController;
        cancelController = Controller(canvas, status, setStatus, setting, divRef.current);

        let requestId;
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
                if (
                    setting.map[luPos.y + j][luPos.x + i].layer.isOverlap(
                        constant.typeLayerPairs[newType]
                    )
                )
                    return;
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
        ["none", "空地"],
        ["block", "場外"],
        ["start", "起點"],
        ["end", "終點"],
        ["dead", "毒面"],
        ["ice", "冰面"],
        ["muddy", "泥面"],
    ];

    return (
        <>
            <div>
                <canvas
                    id="EditModeCanvas"
                    ref={canvasRef}
                    width={`${props.width}`}
                    height={`${props.height}`}
                    style={{ textAlign: "center" }}
                ></canvas>
                <div
                    style={{
                        width: 1024,
                        height: 64,
                        backgroundColor: 'white',
                        margin: '0px auto'
                }}><div ref={divRef} id="EditModeParameters">
                        {status.select ? (
                            <div style={{ textAlign: "center" }}>
                                {typeButtonPairs.map((pair) => (
                                    <Button
                                        size="small"
                                        // color="primary"
                                        color="secondary"
                                        variant="outlined"
                                        onClick={() => {
                                            changeSelectedGridsType(pair[0]);
                                        }}
                                        disabled={!status.select}
                                    >
                                        {pair[1]}
                                    </Button>
                                ))}
                            </div>
                        ) :<div></div>/* (
                                <div>
                                    <IconButton
                                        size="small"
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => props.save(setting)}
                                    >
                                        <SaveIcon />
              Save
            </IconButton>
                                </div>
                            )*/}
                        {status.holding || status.hold ? (
                            <div>
                                {Object.keys(status.holdDetail).map((p) => {
                                    switch (status.holdDetail[p].type) {
                                        case "text":
                                            return (
                                                <div style={{
                                                    border: `1px solid black`,
                                                    display: 'inline-block',
                                                    width: '168px',
                                                    height: '26px',
                                                    float: 'left'
                                                }}>
                                                    <label style={{
                                                        display: 'inline-block',
                                                        width: '80px',
                                                        textAlign: 'left'
                                                    }}>{p}</label>
                                                    <input
                                                        key={p}
                                                        type="text"
                                                        className="parametersInput"
                                                        value={status.holdObject.detail[p]}
                                                        onChange={(e) => {
                                                            let newStatus = { ...status };
                                                            let newDetail = { ...status.holdObject.detail };
                                                            newDetail[p] = e.target.value;
                                                            newStatus.holdObject.detail = newDetail;
                                                            setStatus(newStatus);
                                                        }}
                                                        style={{ width: '80px' }}
                                                    />
                                                </div>
                                            );
                                        case "select":
                                            return (
                                                <div style={{
                                                    border: `1px solid black`,
                                                    display: 'inline-block',
                                                    width: '168px',
                                                    height: '26px',
                                                    float: 'left'
                                                }}>
                                                    <label style={{
                                                        display: 'inline-block',
                                                        width: '80px',
                                                        textAlign: 'left'
                                                    }}>{p}</label>
                                                    <select
                                                        key={p}
                                                        className="parametersSelect"
                                                        value={status.holdObject.detail[p]}
                                                        onChange={(e) => {
                                                            let newStatus = { ...status };
                                                            let newDetail = { ...status.holdObject.detail };
                                                            newDetail[p] = e.target.value;
                                                            newStatus.holdObject.detail = newDetail;
                                                            setStatus(newStatus);
                                                        }}
                                                        style={{ width: '80px' }}
                                                    >
                                                        {status.holdDetail[p].options.map((o) => (
                                                            <option key={o} value={o}>
                                                                {o}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            );
                                        case "int":
                                            return (
                                                <div style={{
                                                    border: `1px solid black`,
                                                    display: 'inline-block',
                                                    width: '168px',
                                                    height: '26px',
                                                    float: 'left'
                                                }}>
                                                    <label style={{
                                                        display: 'inline-block',
                                                        width: '80px',
                                                        textAlign: 'left',
                                                    }}>{p}</label>
                                                    <input
                                                        key={p}
                                                        type="text"
                                                        className="parametersInput"
                                                        placeholder={status.holdObject.detail[p]}
                                                        onKeyUp={(e) => {
                                                            if (e.key === "Enter") {
                                                                e.preventDefault();
                                                                let newStatus = { ...status };
                                                                let newDetail = { ...status.holdObject.detail };
                                                                let newValue = ~~e.target.value;
                                                                newDetail[p] =
                                                                    newValue < status.holdDetail[p].min
                                                                        ? status.holdDetail[p].min
                                                                        : newValue > status.holdDetail[p].max
                                                                            ? status.holdDetail[p].max
                                                                            : newValue;
                                                                e.target.value = newDetail[p];
                                                                newStatus.holdObject.detail = newDetail;
                                                                setStatus(newStatus);
                                                            }
                                                        }}
                                                        style={{ width: '76px' }}
                                                    />
                                                </div>
                                            );
                                        case "check":
                                            return (
                                                <div style={{
                                                    border: `1px solid black`,
                                                    display: 'inline-block',
                                                    width: '168px',
                                                    height: '26px',
                                                    float: 'left'
                                                }}>
                                                    <input
                                                        key={`input_${p}`}
                                                        type="checkbox"
                                                        className="parametersCheck"
                                                        checked={status.holdObject.detail[p]}
                                                        onChange={(e) => {
                                                            let newStatus = { ...status };
                                                            let newDetail = { ...status.holdObject.detail };
                                                            newDetail[p] = e.target.checked;
                                                            newStatus.holdObject.detail = newDetail;
                                                            setStatus(newStatus);
                                                        }}
                                                        style={{ float: 'left' }}
                                                    />{" "}
                                                    <label key={`label_${p}`} style={{
                                                        display: 'inline-block',
                                                        width: '80px',
                                                        textAlign: 'left'
                                                    }}>{p}</label>
                                                </div>
                                            );
                                        default:
                                            return <div></div>;
                                    }
                                })}
                            </div>
                        ) : (
                                <div></div>
                            )}
                    </div></div>
            </div>
        </>
    );
}

export default EditGameMode;
