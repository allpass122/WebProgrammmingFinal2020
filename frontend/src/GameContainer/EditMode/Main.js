import React, {
    useState,
    useEffect,
    useRef,
    useImperativeHandle,
    forwardRef,
} from "react";
import Drawer from "./Drawer";
import Engine from "./Engine";
import Controller from "./Controller";
import Vec2 from "../Class/Vec2";
import constant from "../constant";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import SaveIcon from "@material-ui/icons/Save";
import Modal from "@material-ui/core/Modal";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import { unpackage, enpackage } from "../DataPackager";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));
const EditGameMode = forwardRef((props, ref) => {
    const canvasRef = useRef();
    const classes = useStyles();
    const [value, setValue] = useState(1);

    let setting = props.setting;
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
        active: true,
        opt: 0,
    });
    const reset = () => {
        props.save(setting);
    };
    useImperativeHandle(ref, () => ({
        returnSetting() {
            props.save(setting);
        },
    }));

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        let cancelController;
        cancelController = Controller(canvas, status, setStatus, setting, reset);

        let requestId;
        const update = () => {
            /* �C�@��(fps = 60)�i�檺��s */
            if (status.active) Engine(setting.objects);
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
        let oldTypes = [];
        for (let i = 0; i < range.x; i++) {
            for (let j = 0; j < range.y; j++) {
                oldTypes.push(setting.map[luPos.y + j][luPos.x + i].type);
                setting.map[luPos.y + j][luPos.x + i].type = newType;
            }
        }
        let hasStart = false, hasEnd = false;
        for (let i = 0; i < constant.mapSize.x; i++) {
            for (let j = 0; j < constant.mapSize.y && (!hasEnd || !hasStart); j++) {
                if (setting.map[j][i].type === 'start') hasStart = true;
                else if (setting.map[j][i].type === 'end') hasEnd = true;
            }
        }
        console.log(hasStart);
        if (!hasEnd || !hasStart) {
            for (let i = 0; i < range.x; i++) {
                for (let j = 0; j < range.y; j++) {
                    setting.map[luPos.y + j][luPos.x + i].type = oldTypes.shift();
                }
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
                    width={`1200px`}
                    height={`582px`}
                    style={{ textAlign: "center" }}
                ></canvas>
                <div
                    style={{
                        width: 1024,
                        height: 64,
                        backgroundColor: 'inherit',
                        margin: "0px auto",
                    }}
                >
                    <div id="EditModeParameters" style={{ backgroundColor: "inherit" }}>
                        {status.select ? (
                            <div style={{ textAlign: "center" }}>
                                {typeButtonPairs.map((pair) => (
                                    <Button
                                        size="small"
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
                        ) : (
                                <div></div>
                            )}
                        {status.holding || status.hold ? (
                            <div style={{ backgroundColor: "inherit", marginRight: "0.1cm" }}>
                                {Object.keys(status.holdDetail).map((p) => {
                                    switch (status.holdDetail[p].type) {
                                        case "text":
                                            return (
                                                <div
                                                    style={{
                                                        display: "inline-block",
                                                        float: "left",
                                                        backgroundColor: "inherit",
                                                        marginRight: "1cm",
                                                    }}
                                                >
                                                    <TextField
                                                        label="Name"
                                                        value={status.holdObject.detail[p]}
                                                        onChange={(e) => {
                                                            let newStatus = { ...status };
                                                            let newDetail = { ...status.holdObject.detail };
                                                            newDetail[p] = e.target.value;
                                                            newStatus.holdObject.detail = newDetail;
                                                            setStatus(newStatus);
                                                        }}
                                                    />
                                                </div>
                                            );
                                        case "select":
                                            return (
                                                <div
                                                    style={{
                                                        display: "inline-block",
                                                        float: "left",
                                                        backgroundColor: "inherit",
                                                        marginRight: "1cm",
                                                    }}
                                                >
                                                    <FormControl
                                                        variant="outlined"
                                                        className={classes.formControl}
                                                    >
                                                        <InputLabel>{p}</InputLabel>
                                                        <Select
                                                            value={status.holdObject.detail[p]}
                                                            onChange={(e) => {
                                                                let newStatus = { ...status };
                                                                let newDetail = { ...status.holdObject.detail };
                                                                newDetail[p] = e.target.value;
                                                                newStatus.holdObject.detail = newDetail;
                                                                setStatus(newStatus);
                                                            }}
                                                            label={p}
                                                        >
                                                            {status.holdDetail[p].options.map((o) => (
                                                                <MenuItem value={o}>{o}</MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </div>
                                            );
                                        case "int":
                                            return (
                                                <div
                                                    style={{
                                                        display: "inline-block",
                                                        float: "left",
                                                        backgroundColor: "inherit",
                                                        marginRight: "1cm",
                                                    }}
                                                >
                                                    <Typography id="discrete-slider" gutterBottom>
                                                        {p}
                          </Typography>
                                                    <Slider
                                                        style={{ minWidth: 300 }}
                                                        value={status.holdObject.detail[p]}
                                                        aria-labelledby="discrete-slider"
                                                        valueLabelDisplay="auto"
                                                        step={1}
                                                        marks
                                                        min={status.holdDetail[p].min}
                                                        max={status.holdDetail[p].max}
                                                        onChange={(e, newValue) => {
                                                            let newStatus = { ...status };
                                                            let newDetail = { ...status.holdObject.detail };
                                                            newDetail[p] = newValue;
                                                            newStatus.holdObject.detail = newDetail;
                                                            setStatus(newStatus);
                                                        }}
                                                    />
                                                </div>
                                            );
                                        case "check":
                                            return (
                                                <div
                                                    style={{
                                                        display: "inline-block",
                                                        float: "left",
                                                        backgroundColor: "inherit",
                                                        marginRight: "1cm",
                                                    }}
                                                >
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={status.holdObject.detail[p]}
                                                                onChange={(e) => {
                                                                    let newStatus = { ...status };
                                                                    let newDetail = {
                                                                        ...status.holdObject.detail,
                                                                    };
                                                                    newDetail[p] = e.target.checked;
                                                                    newStatus.holdObject.detail = newDetail;
                                                                    setStatus(newStatus);
                                                                }}
                                                            />
                                                        }
                                                        label={p}
                                                    />
                                                </div>
                                            );
                                        default:
                                            return <div></div>;
                                    }
                                })}
                            </div>
                        ) : (
                                <div style={{ backgroundColor: "inherit" }}></div>
                            )}
                    </div>
                </div>
            </div>
        </>
    );
});

export default EditGameMode;
