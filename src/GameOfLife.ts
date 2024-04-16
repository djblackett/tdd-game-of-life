import fs from "node:fs";
import { Board } from "./Board";

export class GameOfLife {
  width = -1;
  height = -1;
  metadata: string[] = []

  startingShape = [[""]];

  static readFile(url: string) {
    try {
      const input = fs.readFileSync(url, { encoding: 'utf8' })
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
    let data = ""

    for (let line of lines) {
      if (line.startsWith("#")) {
        this.metadata.push(line);
      }

      if (line.startsWith("x")) {
        structure = line;
        this.metadata.push(line);
      }

      if (line.charAt(0).match(/[bo\d]/)) {
        data += line;
      }
    }

    // console.log(data);
    const metaArr = structure?.split(",");
    let x;
    let y;
    if (metaArr) {
      x = metaArr[0].split("=")[1].trim();
      y = metaArr[1].split("=")[1].trim();
    }


    if (!x || !y) {
       throw new Error("Data is missing")
    }

    this.width = parseInt(x);
    this.height = parseInt(y);

    if (data) {
      let lines = data.split("$");
      let tempGrid: string[][] = [[""]];

      for (let row = 0; row < lines.length; row++) {
        let str = "";
        let digits = ""
        let isRun = false;
        for (let char = 0; char < lines[row].length; char++) {

          // problem is here
          if (lines[row][char].match(/\d/)) {
            isRun = true;
            digits += lines[row][char];

          } else if (!lines[row][char].match(/\d/) && isRun) {
            isRun = false;
            str += lines[row][char].repeat(parseInt(digits));
            digits = "";
            // char++;
          } else if (lines[row][char].match("[a-z]")) {
            str += lines[row][char];
          }
        }
        tempGrid[row] = str.padEnd(parseInt(x), "b").split("");
        // console.log(tempGrid[row]);
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

  removeTrailingDeadCells(rle: string) {
    const regex = /\d*b\$/g
    let fixedString = rle.replaceAll(regex, "$");
    fixedString = fixedString.replaceAll(/\d*b!$/g, "!");
    return fixedString
  }

  addRepeatedLines(rle: string){
    const arr = rle.split("$");
    for (let i = 0; i < arr.length; i++) {
      let matcher = arr[i].charAt(arr[i].length - 1).match("\d+")
      if (matcher) {
        arr[i] = (arr[i] + "$").repeat(parseInt(matcher[1]));
        arr[i] = arr[i].substring(0, arr[i].length - 1)
      }
    }
    return arr.join("$")
  }

  addRepeatedLinesGrid(arr: string[][]) {
    for (let i = 0; i < arr.length; i++) {
      let line = arr[i].join("")
      let matcher = line.charAt(line.length - 1).match("\d+")
      if (matcher) {
        line = (line + "$").repeat(parseInt(matcher[1]));
        line = line.substring(0, line.length - 1)
        arr[i] = line.split("")
      }
    }
    return arr.join("$")
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
    return this.getFullOutputAfterGenerations(inputString, generations);
  }

  outputGame() {
    const game = new GameOfLife();
    const inputString = GameOfLife.readFile("test/snark-loop.rle");
    const shape = this.parseRLEString(inputString);
    const board = new Board(9, 36);
    board.placeShape(shape, 0, 0)
    // console.log(board.grid);
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
      board.setGrid(game.evolve(board, 9, 36));
      await sleep(500)
  }

  // console.log("width", board.width);
  // console.log("height:", board.height);
}

play()
