import { describe, test } from "vitest";
import { Board } from "../src/Board";
import { expect } from "chai";
import { GameOfLife } from "../src/GameOfLife";

describe("basic board functionality", () => {
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

  test.skip("should return neighbors of a cell on an edge of board with wrap around", () => {
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

    const shape = [
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

  test("should isolate shape for shapes that have different length/width after generation - blinker test", () => {
    const blinkerGrid = [
      ['b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b'],
      ['b', 'b', 'b', 'o', 'b', 'b', 'b', 'b', 'b'],
      ['b', 'b', 'b', 'o', 'b', 'b', 'b', 'b', 'b'],
      ['b', 'b', 'b', 'o', 'b', 'b', 'b', 'b', 'b'],
      ['b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b'],
      ['b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b'],
      ['b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b'],
      ['b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b'],
      ['b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b']
    ]
    const board = new Board(9, 9);
    board.setGrid(blinkerGrid);
    const isolatedShape = board.isolateShape()
    // console.log(isolatedShape)
    expect(isolatedShape).to.deep.equal([["o"], ["o"], ["o"]])


  })
})