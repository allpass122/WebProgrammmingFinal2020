import React, { useState, useEffect, useRef } from "react";
import Drawer from "./Drawer";
import Controller from "./Controller";
import Vec2 from "../Class/Vec2";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import SaveIcon from "@material-ui/icons/Save";

function EditGameMode(props) {
  let canvasRef = useRef();
  let setting = props.setting;
  // console.log(setting);
  const [status, setStatus] = useState({
    mousePos: new Vec2(),
    select: false,
    selecting: false,
    selectPair: [new Vec2(), new Vec2()],
    hold: false,
    holdObject: null,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

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

  const leftUpPos = (p1, p2) =>
    new Vec2(Math.min(p1.x, p2.x), Math.min(p1.y, p2.y));
  const RightDownPos = (p1, p2) =>
    new Vec2(Math.max(p1.x, p2.x), Math.max(p1.y, p2.y));

  const changeSelectedGridsType = (newType) => {
    if (!status.select) return;
    let luPos = leftUpPos(status.selectPair[0], status.selectPair[1]);
    let rdPos = RightDownPos(status.selectPair[0], status.selectPair[1]);
    let range = rdPos.sub(luPos).add(new Vec2(1, 1));

    for (let i = 0; i < range.x; i++) {
      for (let j = 0; j < range.y; j++) {
        setting.map[luPos.y + j][luPos.x + i].type = newType;
      }
    }
  };

  const typeButtonPairs = [
    ["none", "None"],
    ["block", "Block"],
    ["none start", "Start"],
    ["none end", "End"],
    ["none dead", "Dead"],
    ["none ice", "Ice"],
    ["none muddy", "Muddy"],
  ];

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <canvas
          id="EditModeCanvas"
          ref={canvasRef}
          width={`${props.width}`}
          height={`${props.height}`}
        ></canvas>
      </div>
      <div id="EditModeParameters">
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
              >
                {pair[1]}
              </Button>
              //   <button
              //     class="typeButton"
              //     onClick={() => {
              //       changeSelectedGridsType(pair[0]);
              //     }}
              //   >
              //     {pair[1]}
              //   </button>
            ))}
          </div>
        ) : (
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
        )}
        {status.hold ? (
          <div>
            {Object.keys(status.holdObject.detail).map((key) => (
              <input
                type="text"
                className="parametersInput"
                placeholder={key}
                onChange={(e) => {
                  status.holdObject.detail[key] = e.target.value;
                }}
              />
            ))}
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </>
  );
}

export default EditGameMode;
