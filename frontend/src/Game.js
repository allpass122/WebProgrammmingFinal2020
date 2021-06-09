import React, { useState, useEffect } from "react";
import GridRow from "./Components/GridRow";

function Game() {
  // n by n grid
  let size = 8;

  const [grids, setGrids] = useState(
    Array.from(Array(10), () => new Array(size))
  );
  const [colNumber, setColNumber] = useState(size);
  const [rowNumber, setRowNumber] = useState(size);

  const initialGrid = () => {
    let i, j;
    let copy = [...grids];
    for (i = 0; i < rowNumber; i++) {
      for (j = 0; j < colNumber; j++) {
        copy[i][j] = { id: i * rowNumber + j, type: 0 };
      }
    }
    copy[2][3].type = 1;
    setGrids(copy);
  };
  useEffect(() => {
    initialGrid();
  }, []);
  return (
    <div className="Game">
      <table className="Table">
        <tbody>
          {grids.map((grid) => (
            <GridRow colNumber={colNumber} rowNumber={rowNumber} grid={grid} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default Game;
