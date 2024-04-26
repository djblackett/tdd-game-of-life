import { describe, test } from "vitest";
import { expect } from "chai";
import { GameOfLife } from "../src/GameOfLife";
import { Board } from "../src/Board";
import { DataFormatter } from "../src/DataFormatter";
import { RLEWriter } from "../src/RLEWriter";
import { RLEReader } from "../src/RLEReader";
import { lobster, snarkGeneration2, snark, snarkAfter1Evolution } from "./rle-objects.mjs";

describe("Game of Life", () => {

  describe("core game logic", () => {

    const game = new GameOfLife();
    const shape = [
      ["b", "o", "b"],
      ["b", "b", "o"],
      ["o", "o", "o"]
    ];


    test("should return next generation of game board from given board", () => {
      const HEIGHT = 5;
      const WIDTH = 5
      const board = new Board(5, 5);
      board.placeShape(shape, 1, 1);
      board.setGrid(game.evolve(board, HEIGHT, WIDTH));
      const result = board.isolateShape(3, 3);
      const expected = [['o', 'b', 'o'], ['b', 'o', 'o'], ['b', 'o', 'b']];

      expect(result).to.deep.equal(expected);
    });

    test("should return proper shape after 2 generations", () => {
      const HEIGHT = 8;
      const WIDTH = 8;
      const board = new Board(HEIGHT, WIDTH);
      board.placeShape(shape, 2, 2);
      board.setGrid(game.evolve(board, HEIGHT, WIDTH));
      board.setGrid(game.evolve(board, HEIGHT, WIDTH));
      const result = board.isolateShape(3, 3);
      const expected = [["b", "b", "o"], ["o", "b", "o"], ["b", "o", "o"]] // need shape

      expect(result).to.deep.equal(expected);
    })

    test("should return proper shape after 3 generations", () => {
      const HEIGHT = 8;
      const WIDTH = 8;
      const board = new Board(HEIGHT, WIDTH);
      board.placeShape(shape, 2, 2);
      board.setGrid(game.evolve(board, HEIGHT, WIDTH));
      board.setGrid(game.evolve(board, HEIGHT, WIDTH));
      board.setGrid(game.evolve(board, HEIGHT, WIDTH));

      const result = board.isolateShape(3, 3);
      const expected = [["o", "b", "b"], ["b", "o", "o"], ["o", "o", "b"]]
      expect(result).to.deep.equal(expected);
    })

    test("should return RLE string with metadata after 3 generations", () => {
      const game1 = new GameOfLife()
      const expected = "x = 3, y = 3, rule = B3/S23\n" +
        "o2b$b2o$2ob!"

      const inputPattern = "x = 3, y = 3, rule = B3/S23\n" + "bob$2bo$3o!"
      const numberOfGenerations = 3
      const result = game1.getFullOutputAfterGenerations(inputPattern, numberOfGenerations);
      expect(result).to.deep.equal(expected);
    })

    test("should read full RLE from file and output full RLE with metadata", async () => {
      const game = new GameOfLife();
      const expected = "#N Glider\n" +
        "#O Richard K. Guy\n" +
        "#C The smallest, most common, and first discovered spaceship. Diagonal, has period 4 and speed c/4.\n" +
        "#C www.conwaylife.com/wiki/index.php?title=Glider\n" +
        "x = 3, y = 3, rule = B3/S23\n" +
        "o2b$b2o$2ob!"

      const result = await game.readAndOutputGeneration("test/rle-files/glider.rle", 3);
      expect(result).toEqual(expected);
    })

    test("should work end to end for block shape", async () => {
      const game = new GameOfLife();
      const expected = "#N Block\n#C An extremely common 4-cell still life.\n#C www.conwaylife.com/wiki/index.php?title=Block\nx = 2, y = 2, rule = B3/S23\n2o$2o!"

      const result = await game.readAndOutputGeneration("test/rle-files/block.rle", 3);
      expect(result).toEqual(expected);
    });

    test("should work end to end for gosper gun shape, 3 generations", async () => {
      const game = new GameOfLife();
      const rleWriter = new RLEWriter();
      const expected = "x = 36, y = 9, rule = B3/S23\n" +
        "22bo$21bobo$11b2o6b2o3bo9b2o$10bobo4b2obo3bo9b2o$2o7b3o4b3obo3bo$2o6b\n" +
        "3o4bo2b2obobo$9b3o4b2o4bo$10bobo$11b2o!"

      const result = await game.readAndOutputGeneration("test/rle-files/gosper-gun.rle", 3);
      const finalResult = rleWriter.removeTrailingDeadCells(result);
      const shortened = rleWriter.shortenRLEString(finalResult);
      expect(shortened).toEqual(expected);
    });


    // come back to this later
    test("should output correct rle for snark loop, 1 generation", async () => {
      const game = new GameOfLife();
      const result = await game.endToEnd("test/rle-files/snark-loop.rle", 1);
      let expected = snarkGeneration2
      const expectedLines = expected.split("$");
      // expect(result.replaceAll("\n", "").split("$")).toEqual(expected.replaceAll("\n", "").split("$"));
      expect(result.replaceAll("\n", "")).toEqual(expected.replaceAll("\n", ""));
      // expect(result).toEqual(expected);
    });


    test("should return snark loop rle with no parsing or evolution", () => {
      const string = RLEReader.readFile("test/rle-files/snark-loop.rle")
      expect(string).toEqual(snark);
    })

    test("should output a grid with length of 'y' value in metadata", () => {
      const reader = new RLEReader()
      const string = RLEReader.readFile("test/rle-files/snark-loop.rle")
      const grid = reader.parseRLEString(string);
      expect(grid).toHaveLength(65);
    });

    test("should return snark loop rle after parsing but no evolution", async () => {
      const result = await game.endToEnd("test/rle-files/snark-loop.rle", 0)
      expect(result).toEqual(snark);
    })

    test("blinker", async () => {
      const df = new DataFormatter();
      const expected = "#N Blinker\n" +
        "#O John Conway\n" +
        "#C A period 2 oscillator that is the smallest and most common oscillator.\n" +
        "#C www.conwaylife.com/wiki/index.php?title=Blinker\n" +
        "x = 3, y = 1, rule = B3/S23\n" +
        "o$o$o!";

      const result = await game.readAndOutputGeneration("test/rle-files/blinker.rle", 1);
      const finalResult = df.removeTrailingDeadCells(result);
      expect(finalResult).toEqual(expected);
    });

    test("loaf", async () => {
      const game = new GameOfLife();
      const result = await game.endToEnd("test/rle-files/loaf.rle", 5);
      const expected = "#N Loaf\n" +
        "#C A very common 7-cell still life.\n" +
        "#C www.conwaylife.com/wiki/index.php?title=Loaf\n" +
        "x = 4, y = 4, rule = B3/S23\n" +
        "b2o$o2bo$bobo$2bo!"

      expect(result).toEqual(expected);
    });

    test("mozart", async () => {
      const game = new GameOfLife();
      const result = await game.endToEnd("test/rle-files/mozart.rle", 5);
      const expected = "#N mozart.rle\n" +
        "#C https://conwaylife.com/wiki/Composers\n" +
        "#C https://www.conwaylife.com/patterns/mozart.rle\n" + "x = 11, y = 7, rule = B3/S23\n" +
        "2o7b2o$2o7b2o2$5bo$4bobo$4bobo$5bo!"
      expect(result).toEqual(expected);
    })


    // todo - update x and y if they change during evolution
    // todo - double check that multiplier digits aren't being truncated
    test.skip("should output rle for 2nd generation of Lobster", async () => {
      const game = new GameOfLife();
      const reader = new RLEReader();
      const example = RLEReader.readFile("test/rle-files/lobster.rle");
      console.log(reader.parseRLEString(example));
      const result = await game.endToEnd("test/rle-files/lobster.rle", 1);
      const expected = "#N lobster.rle\n" +
        "#O Matthias Merzenich, 2011\n" +
        "#C https://conwaylife.com/wiki/Lobster_(spaceship)\n" +
        "#C https://www.conwaylife.com/patterns/lobster.rle\n" +
        "x = 27, y = 27, rule = B3/S23\n" +
        "13b2o$13bobo$13bo$13bo2b3o$13bob4o$13bob2o$13bo2bo$14b2o3$16b2ob2o$16b\n" +
        "2o3bo$16b2o$7o13b2o$o6bo12bo3bo$bo2b2obo10b2o2bo2bo$3b4o3b3o7bobo2bo$\n" +
        "3b2o5b3o6bo2bobo$3b2o10bo4bo$10bo4bobob2o$10bo2b2obob3o3bo$11bobo9bo2b\n" +
        "o$15b3o6bobo$21bo3bo$14bo2bo2bobo$15b2o6bo$21b2o!"

        expect(result.replaceAll("\n", "")).toEqual(expected.replaceAll("\n", ""));
    })

    test("should return the same string as is in the lobster.rle file", () => {
      const result = RLEReader.readFile("test/rle-files/lobster.rle");
      expect(result).toEqual(lobster)
    })

    test("should return the same string as is in the lobster.rle file after parsing but no evolutions", async () => {
      const result = await game.endToEnd("test/rle-files/lobster.rle", 0);
      expect(result.replaceAll("\n", "")).toEqual(lobster.replaceAll("\n", ""))
    })


    test("lobster should output a grid with length of 'y' value in metadata", () => {
      const reader = new RLEReader()
      const string = RLEReader.readFile("test/rle-files/lobster.rle")
      const grid = reader.parseRLEString(string);
      expect(grid).toHaveLength(26);
    });


  })
})
