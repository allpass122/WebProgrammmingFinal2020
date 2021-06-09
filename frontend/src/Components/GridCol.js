import React from "react";
function GridCol(props) {
  let ClassName = `Grid grid${props.val.type}`;
  return (
    <>
      <td tabindex="0" id={props.val.id} className={ClassName}>
        {props.val.id}
      </td>
    </>
  );
}

export default GridCol;
