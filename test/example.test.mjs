import { describe, test } from "vitest";
import { expect } from "chai";
import { GameOfLife } from "../src/GameOfLife";


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

    const game = new GameOfLife()
    game.parseRLEString(glider);
    const result = game.getNeighbors(shape, 1, 1);

    // assuming middle cell
    const expected = ["b", "o", "b", "b", "o", "o", "o", "o"];

    expect(result.length).toEqual(8);
    expect(result).to.deep.equal(expected)
  });

  test("should calculate number of living neighbors", () => {
    const neighbors = ["b", "o", "b", "b", "o", "o", "o", "o"];
    const game = new GameOfLife()
    const result = game.calculateLivingNeighbors(neighbors);
    expect(result).toEqual(5);
  })

  test("should return neighbors of a cell on an edge of board with wrap around", () => {
    const shape = [
      ["b", "o", "b"],
      ["b", "b", "o"],
      ["o", "o", "o"]
    ];

    const game = new GameOfLife()
    game.parseRLEString(glider);
    const result = game.getNeighbors(shape, 1, 2);
    const expected = ["o", "b", "b", "b", "b", "o", "o", "o"];

    expect(result).to.deep.equal(expected);
  });




});
