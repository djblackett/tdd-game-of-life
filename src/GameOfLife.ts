import fs from "node:fs/promises";
import { Board } from "./Board";

export class GameOfLife {
  width = -1;
  height = -1;
  metadata: string[] = []

  startingShape = [[""]];

  static async readFile(url: string) {
    try {
      const input = await fs.readFile(url, { encoding: 'utf8' })
      if (input) {
        return input.trim().replaceAll("\r", "");
      }
      throw new Error()
    } catch (e) {
      console.error(e);
      throw new Error("Error reading RLE file!")
    }
  }

  parseRLEString(input: string) {
    const lines = input.split("\n");
    let structure;
    let data;

    for (let line of lines) {
      if (line.startsWith("#")) {
        this.metadata.push(line);
      }

      if (line.startsWith("x")) {
        structure = line;
        this.metadata.push(line);
      }

      if (line.endsWith("!")) {
        data = line;
      }
    }

    const metaArr = structure?.split(",");
    let x;
    let y;
    if (metaArr) {
      x = metaArr[0].split("=")[1].trim();
      y = metaArr[1].split("=")[1].trim();
    }

    if (x && y) {
      this.width = parseInt(x);
      this.height = parseInt(y);
    }

    if (data) {
      let lines = data.split("$");
      let tempGrid = [];

      for (let row = 0; row < lines.length; row++) {
        let str = "";
        for (let char = 0; char < lines[row].length; char++) {
          if (lines[row][char].match(/\d/)) {
            str += lines[row][char + 1].repeat(parseInt(lines[row][char]));
            char++;
          } else if (lines[row][char].match("[a-z]")) {
            str += lines[row][char];
          }
        }
        tempGrid[row] = str.split("");
      }
      this.startingShape = tempGrid;
      return tempGrid;
    } else {
      throw new Error("RLE string could not be parsed");
    }
  }

  outputRLE(shape: string[][], height: number, width: number) {
    const charArr = [];
    for (let i = 0; i < height; i++) {
      let str = "";
      let count = 1;
      let isRun = false;

      for (let j = 0; j < width; j++) {
        let char = shape[i][j];
        let char2 = shape[i][j + 1];

        if (char === char2) {
          isRun = true;
          count++;
        } else if (char !== char2 && isRun) {
          str += count + char;
          isRun = false;
          count = 1;
        } else {
          str += char;
        }
      }
      charArr[i] = str;
    }
    return charArr.join("$") + "!";
  }

  outputFullRLE(shape: string[][], height: number, width: number) {
    let str = this.metadata.join("\n");
    str += "\n" + this.outputRLE(shape, height, width);
    return str;
  }

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
    board.placeShape(shape, 0, 0)

    for (let i = 0; i < generations; i++) {
      board.setGrid(this.evolve(board, height, width));
    }
    return board.isolateShape(shape.length, shape[0].length);
  }

  getOutputAfterGenerations(inputPattern: string, generations: number) {
    const shape = this.parseRLEString(inputPattern);
    const boundingBox = this.getBoundingBoxAfterGenerations(shape, generations)
    return  this.outputRLE(boundingBox, shape.length, shape[0].length)
  }

  getFullOutputAfterGenerations(inputPattern: string, generations: number) {
    const shape = this.parseRLEString(inputPattern);
    const boundingBox = this.getBoundingBoxAfterGenerations(shape, generations)
    const patternString = this.outputRLE(boundingBox, shape.length, shape[0].length);
    // const structure = this.metadata.length > 1 ? this.metadata[this.metadata.length - 1] : this.metadata[0]
    return  this.metadata.join("\n") + "\n" + patternString
  }

  async readAndOutputGeneration(filepath: string, generations: number) {
    const inputString = GameOfLife.readFile(filepath);
    return this.getFullOutputAfterGenerations(await inputString, generations);
  }


}

