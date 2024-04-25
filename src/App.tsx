import React, { useState } from "react";
import { GameOfLife } from "./GameOfLife";
import { Board } from "./Board";
import {snarkLoop } from "./rle-objects/snarkLoop";
import {lobster} from "./rle-objects/lobster";
import { gliderGun } from "./rle-objects/glider-gun";
import { glider } from "./rle-objects/glider";

const game = new GameOfLife();

const gliderGrid = glider;
const lobsterGrid = lobster;
const gliderGunGrid = gliderGun;
const snarkLoopGrid = snarkLoop

// change this grid var to one of the above grids to swap shape displayed
const grid = lobsterGrid

const board = new Board(grid.length + 10, grid[0].length + 10)
board.placeShape(grid, 5, 5);

const App = () => {

  const [state, setState] = useState(board.grid);

  const handleGeneration = () => {
    setState(structuredClone(game.evolve(state, state.length, state[0].length)))
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    event.preventDefault();
    if (event.key === " ") {
      setState(structuredClone(game.evolve(state, state.length, state[0].length)))
    }
  };

  return (
    <div onKeyDown={handleKeyDown} tabIndex={0}>
      <h1>Game of Life</h1>
      <h2>Board visualizer</h2>
      <div className={"grid"}>
        {state.map((row: string[], index) => <div className={"row"} key={"row" + index}>{row.map((cell, idx) => cell === "o" ? <div className={"cell"} key={"row" + index + "column" + idx}></div> : <div className={"dead"} key={"row" + index + "column" + idx}></div>)}</div>)}
      </div>
      <button id={"evolve"} onClick={handleGeneration} onKeyDown={handleKeyDown}>Evolve</button>
      <p>Press button or space bar to evolve</p>
    </div>
  )
}

export default App;

