

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

  isolateShape(shapeHeight: number, shapeWidth: number) {
    let iStart = 1000;
    let jStart = 1000;

    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[0].length; j++) {
        if (this.grid[i][j] === "o") {
          if (i < iStart) {
            iStart = i;
          }
          if (j < jStart) {
            jStart = j;
          }
        }
      }
    }
    const result = [];
    for (let i = iStart; i < iStart + shapeHeight; i++) {
      const row = [];
      for (let j = jStart; j < jStart + shapeWidth; j++) {
        row.push(this.grid[i][j]);
      }
      result.push(row);
    }
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
        neighbors.push(shape[this.wrapCoordinates(i, this.height)][this.wrapCoordinates(j, this.width)]);
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