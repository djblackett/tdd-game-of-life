import { Board } from "./Board";
import { DataFormatter } from "./DataFormatter";
import { RLEReader } from "./RLEReader";
import { RLEWriter } from "./RLEWriter";

export class GameOfLife {

  evolve(currentBoard: Board | string[][], height: number, width: number) {
    let newBoard;
    if (currentBoard instanceof Board) {
      newBoard = structuredClone(currentBoard.grid);
    } else {
      newBoard = new Board(currentBoard.length, currentBoard[0].length);
      newBoard.setGrid(currentBoard);
      currentBoard = newBoard;
      newBoard = structuredClone(currentBoard.grid);
    }
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
    const boundingBox = this.getBoundingBoxAfterGenerations(shape, generations)

    let structure = reader.getMetadata()[reader.getMetadata().length - 1]
    const structureArr = structure.split(",")
    let width = boundingBox[0].length
    let height = boundingBox.length
    // console.log(structure);
    structureArr[0] = "x = " + width.toString();
    structureArr[1] = " y = " + height.toString();
    reader.getMetadata()[reader.getMetadata().length - 1] = structureArr.join(",");

    const writer = new RLEWriter(reader.getMetadata())
    const patternString = writer.outputRLE(boundingBox);
    return  reader.metadata.join("\n") + "\n" + patternString
  }

  async readAndOutputGeneration(filepath: string, generations: number) {
    const inputString = RLEReader.readFile(filepath);
    return this.getFullOutputAfterGenerations(inputString, generations);
  }

  async endToEnd(filepath: string, generations: number, removeTrailingEmptyCells=true) {
    const game = new GameOfLife();
    const rleWriter = new RLEWriter();

    let result = await game.readAndOutputGeneration(filepath, generations);
    if (removeTrailingEmptyCells) {
      result = rleWriter.removeTrailingDeadCells(result);
    }
    result = rleWriter.compressRepeatedLines(result);
    result = rleWriter.shortenRLEString(result);
    return result;
  }


  // Below is for manually reviewing the game state
  outputGame() {
    const reader = new RLEReader()
    const inputString = RLEReader.readFile("test/rle-files/blinker.rle");
    const shape = reader.parseRLEString(inputString);
    const board = new Board(9, 9);
    board.placeShape(shape, 2, 2)
    return board;
  }
}

