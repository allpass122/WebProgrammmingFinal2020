import React from "react";
import GridCol from "./GridCol";
function GridRow(props) {
  return (
    <>
      <tr tabindex="1">
        {props.grid.map((grid) => (
          <GridCol
            val={grid}
            colNumber={props.colNumber}
            rowNumber={props.rowNumber}
          />
        ))}
      </tr>
    </>
  );
}

export default GridRow;
