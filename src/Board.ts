

export class Board {
  width: number;
  height: number;
  grid: string[][];


  constructor(height: number, width: number) {
    this.height = height;
    this.width = width;

    const board: string[][] = []
    for (let i = 0; i < height; i++) {
      board[i] = [];
      for (let j = 0; j < width; j++) {
        board[i][j] = "b";
      }
    }
    this.grid = board
  }

  setGrid(grid: string[][]) {
    this.grid = grid;
  }

  placeShape(shape: string[][], row: number, col: number) {
    try {
      for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[0].length; j++) {
          this.grid[i + row][j + col] = shape[i][j];
        }
      }
      return this.grid;
    } catch (e) {
      console.error("Shape cannot be placed at that board location")
    }
  }

  // todo shapeHeight and shapeWidth can change after generations
  isolateShape() {
    let iStart = 1000;
    let iEnd = -1
    let jStart = 1000;
    let jEnd = -1

    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[0].length; j++) {
        if (this.grid[i][j] === "o") {
          if (i < iStart) {
            iStart = i;
          }
          if (i > iEnd) {
            iEnd = i;
          }
          if (j < jStart) {
            jStart = j;
          }
          if (j > jEnd) {
            jEnd = j;
          }
        }
      }
    }
    const result = [];
    for (let i = iStart; i <= iEnd; i++) {
      const row = [];
      for (let j = jStart; j <= jEnd; j++) {
        row.push(this.grid[i][j]);
      }
      result.push(row);
    }
    console.log(result);
    return result;
  }

  calculateLivingNeighbors(neighbors: string[]) {
    let count = 0;
    for (let i of neighbors) {
      if (i === "o") {
        count++;
      }
    }
    return count;
  }


  getNeighbors(shape: string[][], r: number, c: number) {
    const neighbors = [];

    for (let i = r - 1; i < r + 2; i++) {
      for (let j = c - 1; j < c + 2; j++) {
        if (i === r && j === c
          // || i < 0 || i >= this.height || j < 0 || j > this.width
        ) {
          continue;
        }
        // neighbors.push(shape[i][j]);
        try {
          neighbors.push(shape[this.wrapCoordinates(i, this.height)][this.wrapCoordinates(j, this.width)]);
          // neighbors.push(shape[i][j]);
        } catch(e) {
          // temp idea
          throw new Error("Shape cannot evolve while in this position. Increase board size or move shape");
        }
      }
    }
    return neighbors;
  }

  wrapCoordinates(num: number, size: number) {
    if (num < 0) {
      return size - 1;
    }
    if (num >= size) {
      return 0;
    }
    return num;
  }
}