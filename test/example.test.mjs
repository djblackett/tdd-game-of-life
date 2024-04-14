import { describe, test } from "vitest";
import { expect } from "chai";
import { GameOfLife } from "../src/GameOfLife";
import { Board } from "../src/Board";


const glider = `#N Glider
#O Richard K. Guy
#C The smallest, most common, and first discovered spaceship. Diagonal, has period 4 and speed c/4.
#C www.conwaylife.com/wiki/index.php?title=Glider
x = 3, y = 3, rule = B3/S23
bob$2bo$3o!`

const block = `#N Block
#C An extremely common 4-cell still life.
#C www.conwaylife.com/wiki/index.php?title=Block
x = 2, y = 2, rule = B3/S23
2o$2o!`


describe("Game of Life", () => {

  test("should parse width of input from metadata", () => {
    const gol = new GameOfLife();
    gol.parseRLEString(glider);
    expect(gol.width).to.equal(3);
  })

  test("should parse height of input from metadata", () => {
    const gol = new GameOfLife();
    gol.parseRLEString(glider);
    expect(gol.height).to.equal(3);
  })

  test("should parse an RLE string input and return as matrix", () => {
    const gol = new GameOfLife();
    gol.parseRLEString(glider);
    const expected = [
      ["b", "o", "b"],
      ["b", "b", "o"],
      ["o", "o", "o"]
    ];
    expect(gol.startingShape).to.deep.equal(expected);
  });

  test("should output the matrix as an RLE string", () => {
    const game = new GameOfLife();
    game.parseRLEString(glider);
    const result = game.outputRLE();
    expect(result).to.deep.equal("bob$2bo$3o!");
  })

  test("should read string from RLE file", async () => {
    const expected = `#N Glider
#O Richard K. Guy
#C The smallest, most common, and first discovered spaceship. Diagonal, has period 4 and speed c/4.
#C www.conwaylife.com/wiki/index.php?title=Glider
x = 3, y = 3, rule = B3/S23
bob$2bo$3o!`

    const result = await GameOfLife.readFile("test/glider.rle");
    expect(result).to.deep.equal(expected);
  });

  test("should return pattern in rle format including metadata", () => {
    const game = new GameOfLife();
    game.parseRLEString(glider);
    const result = game.outputFullRLE();
    expect(result).to.deep.equal(glider);
  });

  test("should return all neighbors of a given cell", () => {
    const shape = [
      ["b", "o", "b"],
      ["b", "b", "o"],
      ["o", "o", "o"]
    ];

    const board = new Board(3, 3);
    board.placeShape(shape, 0, 0)
    const result = board.getNeighbors(shape, 1, 1);

    // assuming middle cell
    const expected = ["b", "o", "b", "b", "o", "o", "o", "o"];

    expect(result.length).toEqual(8);
    expect(result).to.deep.equal(expected)
  });

  test("should calculate number of living neighbors", () => {
    const neighbors = ["b", "o", "b", "b", "o", "o", "o", "o"];
    const board = new Board(1, 1)
    const result = board.calculateLivingNeighbors(neighbors);
    expect(result).toEqual(5);
  })

  test("should return neighbors of a cell on an edge of board with wrap around", () => {
    const shape = [
      ["b", "o", "b"],
      ["b", "b", "o"],
      ["o", "o", "o"]
    ];

    const board = new Board(3, 3);
    board.placeShape(shape, 0, 0)
    const result = board.getNeighbors(shape, 1, 2);
    const expected = ["o", "b", "b", "b", "b", "o", "o", "o"];

    expect(result).to.deep.equal(expected);
  });


  // must test on a game board larger than the given block
  test("should return next generation of game board from given board", () => {
    const shape = [
      ["b", "o", "b"],
      ["b", "b", "o"],
      ["o", "o", "o"]
    ];

    const HEIGHT = 5;
    const WIDTH = 5

    const game = new GameOfLife();
    const board2 = new Board(5, 5);
    board2.placeShape(shape, 1, 1);
    board2.setGrid(game.evolve(board2, HEIGHT, WIDTH));
    const result2 = board2.isolateShape(3, 3);
    const expected = [ [ 'o', 'b', 'o' ], [ 'b', 'o', 'o' ], [ 'b', 'o', 'b' ] ];

    expect(result2).to.deep.equal(expected);
  });


  test("should generate game board full of 'dead' cells", () => {
    const expected = new Board(10, 12).grid;

    const board = []
    for (let i = 0; i < 10; i++) {
      board[i] = [];
      for (let j = 0; j < 12; j++) {
        board[i][j] = "b";
      }
    }
    expect(expected).to.deep.equal(board);
  });

  test("should place starting shape on board starting at given row and column", () => {
    const game = new GameOfLife()
    const board2 = new Board(4, 4);

    const shape  = [
      ["b", "o", "b"],
      ["b", "b", "o"],
      ["o", "o", "o"]
    ];

    const result = board2.placeShape(shape, 0, 0);
    const expected = [
      ["b", "o", "b", "b"],
      ["b", "b", "o", "b"],
      ["o", "o", "o", "b"],
      ["b", "b", "b", "b"]
    ];
    expect(result).to.deep.equal(expected);
  });

  // todo should do this without needing to specify the bounding box - find rectangle start and end dynamically
  test("should remove surrounding dead cells to isolate shape on board within its bounding box", () => {

    const grid = [
      ["b", "b", "b", "b", "b"],
      ["b", "b", "o", "b", "b"],
      ["b", "b", "b", "o", "b"],
      ["b", "o", "o", "o", "b"],
      ["b", "b", "b", "b", "b"]
    ];

    const board = new Board(5, 5);
    board.setGrid(grid);
    const result = board.isolateShape(3, 3);

    const expected = [
      ["b", "o", "b"],
      ["b", "b", "o"],
      ["o", "o", "o"]
    ];

    expect(result).to.deep.equal(expected);
  })
});
