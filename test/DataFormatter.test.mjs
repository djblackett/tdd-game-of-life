import { describe, test } from "vitest";
import { DataFormatter } from "../src/DataFormatter";
import { expect } from "chai";
import { gliderGunGrid } from "./GameOfLife.test.mjs";
import { snark0, snark1, snarkArr } from "./snark-fragments.mjs";
import { RLEReader } from "../src/RLEReader";
import { RLEWriter } from "../src/RLEWriter";

const glider = `#N Glider
#O Richard K. Guy
#C The smallest, most common, and first discovered spaceship. Diagonal, has period 4 and speed c/4.
#C www.conwaylife.com/wiki/index.php?title=Glider
x = 3, y = 3, rule = B3/S23
bob$2bo$3o!`

describe("reading and parsing rle patterns", () => {

  test("should read string from RLE file", async () => {
    const expected = `#N Glider
#O Richard K. Guy
#C The smallest, most common, and first discovered spaceship. Diagonal, has period 4 and speed c/4.
#C www.conwaylife.com/wiki/index.php?title=Glider
x = 3, y = 3, rule = B3/S23
bob$2bo$3o!`

    const result = RLEReader.readFile("test/rle-files/glider.rle");
    expect(result).to.deep.equal(expected);
  });

  test("should parse an RLE string input and return as matrix", () => {
    const rleReader = new RLEReader()
    const result = rleReader.parseRLEString(glider);
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
      ["b", "b", "b"],
      ["o", "o", "o"]
    ];
    const rleReader = new RLEReader()
    const result = rleReader.parseRLEString(inputString);
    expect(result).to.deep.equal(expected);
  })

  test("should parse a multi line rle file and return as a matrix", () => {
    const rleReader = new RLEReader()
    const result = rleReader.parseRLEString("x = 36, y = 9, rule = B3/S23\n" +
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


  test("should add a line of empty cells after a line with a number at the end", () => {
    const reader = new RLEReader();
    const grid = reader.parseRLEString(snark0);
    console.log(grid);
    console.table(grid);
    expect(grid).to.deep.equal(snarkArr)
  })


  test("should remove empty lines and add number to end of previous line (before previous '$')", () => {
    const reader = new RLEReader();
    const input = snark0;
    const expected = snark1;
    const grid = reader.parseRLEString(input);
    const writer = new RLEWriter(reader.getMetadata())
    let result = writer.outputFullRLE(grid);
    result = writer.removeTrailingDeadCells(result)
    result = writer.compressRepeatedLines(result)
    result = writer.shortenRLEString(result)
    expect(result).toEqual(expected)
  })

});

describe("processing and outputting rle patterns", () => {

  test("should output text with lines of 70 chars max", () => {
    const input = "x = 19, y = 13, rule = B3/S23\n" +
      "8b2o$8bobo$10bo4b2o$6b4ob2o2bo2bo$6bo2bo3bobob2o$9bobobobo$10b2obobo$\n" +
      "14bo2$2o$bo8bo$bobo5b2o$2b2o!"
    const rleReader = new RLEReader()
    const parsedFile = rleReader.parseRLEString(input);
    const rleWriter = new RLEWriter(rleReader.getMetadata());

    const result = rleWriter.outputFullRLE(parsedFile);
    const shortenedResult = rleWriter.shortenRLEString(result)
    expect(shortenedResult.split("\n")[1].length).toBeLessThanOrEqual(70);
  })

  test("should output the matrix as an RLE string", () => {
    const rleReader = new RLEReader()
    const rleWriter = new RLEWriter(rleReader.getMetadata());
    const shape = rleReader.parseRLEString(glider);
    const result = rleWriter.outputRLE(shape);
    expect(result).to.deep.equal("bob$2bo$3o!");
  })

  test("should return pattern in rle format including metadata", () => {
    const rleReader = new RLEReader();
    const shape = rleReader.parseRLEString(glider);
    const rleWriter = new RLEWriter(rleReader.getMetadata())
    const result = rleWriter.outputFullRLE(shape);
    expect(result).to.deep.equal(glider);
  });

  test("should remove explicitly set empty cells at end of line in RLE string", () => {
    const rleWriter = new RLEWriter();
    const inputArray = [["b", "o", "b"],
      ["b", "b", "o"],
      ["o", "o", "o"]]
    const expected = "bo$2bo$3o!";
    const result = rleWriter.outputRLE(inputArray);
    const finalResult = rleWriter.removeTrailingDeadCells(result)
    expect(finalResult).toEqual(expected)
  })
});