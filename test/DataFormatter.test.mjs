import { test } from "vitest";
import { DataFormatter } from "../src/DataFormatter";
import { expect } from "chai";
import { gliderGunGrid } from "./GameOfLife.test.mjs";

const glider = `#N Glider
#O Richard K. Guy
#C The smallest, most common, and first discovered spaceship. Diagonal, has period 4 and speed c/4.
#C www.conwaylife.com/wiki/index.php?title=Glider
x = 3, y = 3, rule = B3/S23
bob$2bo$3o!`

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

test("should repeat lines when an rle line has a number at the end", () => {
  const df = new DataFormatter();
  const input = "x = 26, y = 6, rule = B3/S23\n" + "24bo$22o$5b7o3$2o!";
  const expected = "x = 26, y = 6, rule = B3/S23\n" + "24bo$22o$5b7o3$2o!"
  const grid = df.parseRLEString(input);
  let result = df.outputFullRLE(grid, grid.length, grid[0].length);
  result = df.addRepeatedLines(result);
  result = df.removeTrailingDeadCells(result)
  result = df.compressRepeatedLines(result)
  expect(result).toEqual(expected)
});

test("should output the matrix as an RLE string", () => {
  const df = new DataFormatter();
  const shape = df.parseRLEString(glider);
  const result = df.outputRLE(shape);
  expect(result).to.deep.equal("bob$2bo$3o!");
})