import { Board } from "./Board";
import { DataFormatter } from "./DataFormatter";
import { RLEReader } from "./RLEReader";
import { RLEWriter } from "./RLEWriter";

export class GameOfLife {

  evolve(currentBoard: Board, height: number, width: number) {
    const newBoard: string[][] = structuredClone(currentBoard.grid);
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const char = currentBoard.grid[i][j];

        // Need a non wrapping version for current test
        const livingNeighbors = currentBoard.calculateLivingNeighbors(currentBoard.getNeighbors(currentBoard.grid, i, j));

        if (char === "o" && livingNeighbors === 2 || livingNeighbors === 3) {
          newBoard[i][j] = "o";
        } else if (char === "b" && livingNeighbors === 3) {
          newBoard[i][j] = "o";
        } else {
          newBoard[i][j] = "b";
        }
      }
    }
    return newBoard
  }

  getBoundingBoxAfterGenerations(shape: string[][], generations: number) {
    const height = shape.length + generations + 3
    const width = shape[0].length + generations + 3
    const board = new Board(height, width);
    board.placeShape(shape, 2, 2)

    for (let i = 0; i < generations; i++) {
      board.setGrid(this.evolve(board, height, width));
    }
    return board.isolateShape();
  }

  getOutputAfterGenerations(inputPattern: string, generations: number) {
    const df = new DataFormatter();
    const shape = df.parseRLEString(inputPattern);
    const boundingBox = this.getBoundingBoxAfterGenerations(shape, generations)
    return  df.outputRLE(boundingBox)
  }

  getFullOutputAfterGenerations(inputPattern: string, generations: number) {
    const reader = new RLEReader();
    const shape = reader.parseRLEString(inputPattern);
    const writer = new RLEWriter(reader.getMetadata())
    const boundingBox = this.getBoundingBoxAfterGenerations(shape, generations)
    const patternString = writer.outputRLE(boundingBox);
    return  reader.metadata.join("\n") + "\n" + patternString
  }

  async readAndOutputGeneration(filepath: string, generations: number) {
    const inputString = RLEReader.readFile(filepath);
    return this.getFullOutputAfterGenerations(inputString, generations);
  }


  // Below is for manually reviewing the game state
  outputGame() {
    const df = new DataFormatter()
    const inputString = DataFormatter.readFile("test/blinker.rle");
    const shape = df.parseRLEString(inputString);
    const board = new Board(9, 9);
    board.placeShape(shape, 2, 2)
    return board;
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function play() {
  const game = new GameOfLife()
  const board = game.outputGame()
  // console.log("width", board.width);
  // console.log("height:", board.height);

  for (let i = 0; i < 5; i++) {
      console.table(board.grid);
    console.log(board.grid);
      board.setGrid(game.evolve(board, 9, 9));
      await sleep(500)
  }

  // console.log("width", board.width);
  // console.log("height:", board.height);
}

// play()
