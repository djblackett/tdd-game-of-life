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






  test.skip("should parse an RLE string input and return as matrix", () => {

    const result = parseRLEString(glider);
    const expected = [
      ["b", "o", "b"],
      ["b", "b", "o"],
      ["o", "o", "o"]
    ];
    expect(result).to.deep.equal(expected);
  });
});
