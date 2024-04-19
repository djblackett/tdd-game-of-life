import { describe, test } from "vitest";
import { DataFormatter } from "../src/DataFormatter";
import { expect } from "chai";
import { gliderGunGrid } from "./GameOfLife.test.mjs";
import { GameOfLife } from "../src/GameOfLife";
import { snark0, snark1 } from "./snark-fragments.js";

const glider = `#N Glider
#O Richard K. Guy
#C The smallest, most common, and first discovered spaceship. Diagonal, has period 4 and speed c/4.
#C www.conwaylife.com/wiki/index.php?title=Glider
x = 3, y = 3, rule = B3/S23
bob$2bo$3o!`

describe("reading and writing the rle patterns", () => {

  test("should read string from RLE file", async () => {
    const expected = `#N Glider
#O Richard K. Guy
#C The smallest, most common, and first discovered spaceship. Diagonal, has period 4 and speed c/4.
#C www.conwaylife.com/wiki/index.php?title=Glider
x = 3, y = 3, rule = B3/S23
bob$2bo$3o!`

    const result = DataFormatter.readFile("test/glider.rle");
    expect(result).to.deep.equal(expected);
  });

  test("should parse an RLE string input and return as matrix", () => {
    const df = new DataFormatter();
    const result = df.parseRLEString(glider);
    const expected = [
      ["b", "o", "b"],
      ["b", "b", "o"],
      ["o", "o", "o"]
    ];
    expect(result).to.deep.equal(expected);
  });

  test("should parse an rle file that contains line multipliers", () => {
    const inputString = "x = 3, y = 4, rule = B3/S23\nbo$2bo2$3o!"
    const expected = [
      ["b", "o", "b"],
      ["b", "b", "o"],
      ["b", "b", "o"],
      ["o", "o", "o"]
    ];
    const df = new DataFormatter()
    const result = df.parseRLEString(inputString);
    expect(result).to.deep.equal(expected);
  })

  test("should parse a multi line rle file and return as a matrix", () => {
    const df = new DataFormatter()

    const result = df.parseRLEString("x = 36, y = 9, rule = B3/S23\n" +
      "24bo$22bobo$12b2o6b2o12b2o$11bo3bo4b2o12b2o$2o8bo5bo3b2o$2o8bo3bob2o4b\n" +
      "obo$10bo5bo7bo$11bo3bo$12b2o!");

    expect(result).to.deep.equal(gliderGunGrid);
  });

  // will conflict with test below
  test.skip("should repeat lines when an rle line has a number at the end", () => {
    const df = new DataFormatter();
    const input = "x = 26, y = 6, rule = B3/S23\n" + "24bo$22o$5b7o3$2o!";
    const expected = "x = 26, y = 6, rule = B3/S23\n" + "24bo$22o$5b7o3$2o!"
    const grid = df.parseRLEString(input);
    let result = df.outputFullRLE(grid);
    result = df.addRepeatedLines(result);
    result = df.removeTrailingDeadCells(result)
    result = df.compressRepeatedLines(result)
    expect(result).toEqual(expected)
  });

  test.skip("should add a line of empty cells after a line with a number at the end", () => {
    const df = new DataFormatter();
    const input = snark0;
    const expected = snark1;
    const grid = df.parseRLEString(input);
    let result = df.outputFullRLE(grid);
    result = df.addRepeatedLines(result);
    result = df.removeTrailingDeadCells(result)
    result = df.compressRepeatedLines(result)
    expect(result).toEqual(expected)

  })

  // write test for shortening line lengths to 70 chars max
  test("should output text with lines of 70 chars max", () => {
    const input = "x = 19, y = 13, rule = B3/S23\n" +
      "8b2o$8bobo$10bo4b2o$6b4ob2o2bo2bo$6bo2bo3bobob2o$9bobobobo$10b2obobo$\n" +
      "14bo2$2o$bo8bo$bobo5b2o$2b2o!"
    const df = new DataFormatter();
    const result = df.outputFullRLE(df.parseRLEString(input));
    expect(result.split("\n")[1].length).toBeLessThanOrEqual(70);

  })

  test("should output the matrix as an RLE string", () => {
    const df = new DataFormatter();
    const shape = df.parseRLEString(glider);
    const result = df.outputRLE(shape);
    expect(result).to.deep.equal("bob$2bo$3o!");
  })



  test("should return pattern in rle format including metadata", () => {
    const df = new DataFormatter();
    const shape = df.parseRLEString(glider);
    const result = df.outputFullRLE(shape);
    expect(result).to.deep.equal(glider);
  });

  test("should remove explicitly set empty cells at end of line in RLE string", () => {
    const game = new GameOfLife()
    const df = new DataFormatter();
    const inputString = [["b", "o", "b"],
      ["b", "b", "o"],
      ["o", "o", "o"]]
    const expected = "bo$2bo$3o!";
    const result = df.outputRLE(inputString);
    const finalResult = df.removeTrailingDeadCells(result)
    expect(finalResult).toEqual(expected)
  })
});