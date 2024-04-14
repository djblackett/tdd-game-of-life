

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


}