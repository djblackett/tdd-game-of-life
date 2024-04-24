import { describe, test } from "vitest";
import { expect } from "chai";
import { GameOfLife } from "../src/GameOfLife";
import { Board } from "../src/Board";
import { DataFormatter } from "../src/DataFormatter";
import { RLEWriter } from "../src/RLEWriter";
import { RLEReader } from "../src/RLEReader";


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

export const gliderGunGrid = [
  [
    'b', 'b', 'b', 'b', 'b', 'b', 'b',
    'b', 'b', 'b', 'b', 'b', 'b', 'b',
    'b', 'b', 'b', 'b', 'b', 'b', 'b',
    'b', 'b', 'b', 'o', 'b', 'b', 'b',
    'b', 'b', 'b', 'b', 'b', 'b', 'b',
    'b'
  ],
  [
    'b', 'b', 'b', 'b', 'b', 'b', 'b',
    'b', 'b', 'b', 'b', 'b', 'b', 'b',
    'b', 'b', 'b', 'b', 'b', 'b', 'b',
    'b', 'o', 'b', 'o', 'b', 'b', 'b',
    'b', 'b', 'b', 'b', 'b', 'b', 'b',
    'b'
  ],
  [
    'b', 'b', 'b', 'b', 'b', 'b', 'b',
    'b', 'b', 'b', 'b', 'b', 'o', 'o',
    'b', 'b', 'b', 'b', 'b', 'b', 'o',
    'o', 'b', 'b', 'b', 'b', 'b', 'b',
    'b', 'b', 'b', 'b', 'b', 'b', 'o',
    'o'
  ],
  [
    'b', 'b', 'b', 'b', 'b', 'b', 'b',
    'b', 'b', 'b', 'b', 'o', 'b', 'b',
    'b', 'o', 'b', 'b', 'b', 'b', 'o',
    'o', 'b', 'b', 'b', 'b', 'b', 'b',
    'b', 'b', 'b', 'b', 'b', 'b', 'o',
    'o'
  ],
  [
    'o', 'o', 'b', 'b', 'b', 'b', 'b',
    'b', 'b', 'b', 'o', 'b', 'b', 'b',
    'b', 'b', 'o', 'b', 'b', 'b', 'o',
    'o', 'b', 'b', 'b', 'b', 'b', 'b',
    'b', 'b', 'b', 'b', 'b', 'b', 'b',
    'b'
  ],
  [
    'o', 'o', 'b', 'b', 'b', 'b', 'b',
    'b', 'b', 'b', 'o', 'b', 'b', 'b',
    'o', 'b', 'o', 'o', 'b', 'b', 'b',
    'b', 'o', 'b', 'o', 'b', 'b', 'b',
    'b', 'b', 'b', 'b', 'b', 'b', 'b',
    'b'
  ],
  [
    'b', 'b', 'b', 'b', 'b', 'b', 'b',
    'b', 'b', 'b', 'o', 'b', 'b', 'b',
    'b', 'b', 'o', 'b', 'b', 'b', 'b',
    'b', 'b', 'b', 'o', 'b', 'b', 'b',
    'b', 'b', 'b', 'b', 'b', 'b', 'b',
    'b'
  ],
  [
    'b', 'b', 'b', 'b', 'b', 'b', 'b',
    'b', 'b', 'b', 'b', 'o', 'b', 'b',
    'b', 'o', 'b', 'b', 'b', 'b', 'b',
    'b', 'b', 'b', 'b', 'b', 'b', 'b',
    'b', 'b', 'b', 'b', 'b', 'b', 'b',
    'b'
  ],
  [
    'b', 'b', 'b', 'b', 'b', 'b', 'b',
    'b', 'b', 'b', 'b', 'b', 'o', 'o',
    'b', 'b', 'b', 'b', 'b', 'b', 'b',
    'b', 'b', 'b', 'b', 'b', 'b', 'b',
    'b', 'b', 'b', 'b', 'b', 'b', 'b',
    'b'
  ]
]

describe("Game of Life", () => {

  describe("reading and writing the rle patterns", () => {

    // todo - decide if these ar even necessary - were scaffolding while developing parseRLEString method
    test.skip("should parse width of input from metadata", () => {
      const gol = new GameOfLife();
      gol.parseRLEString(glider);
      expect(gol.width).to.equal(3);
    })

    test.skip("should parse height of input from metadata", () => {
      const gol = new GameOfLife();
      gol.parseRLEString(glider);
      expect(gol.height).to.equal(3);
    })
  })

  describe("core game logic", () => {

    const game = new GameOfLife();
    const shape = [
      ["b", "o", "b"],
      ["b", "b", "o"],
      ["o", "o", "o"]
    ];

    // must test on a game board larger than the given block
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

    // this won't work because of missing info - empty cells are automatically a 'b'
    test.skip("should return RLE string after 3 generations", () => {
      const expected = "o2b$b2o$2ob!"

      const inputPattern = "bob$2bo$3o!"
      const numberOfGenerations = 3
      const result = game.getOutputAfterGenerations(inputPattern, numberOfGenerations);

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

    // need function that integrates all of the parsing features in 1 workflow. split lines into 70 char chunks at the end
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
    test.skip("should output correct rle for snark loop, 1 generation", async () => {
      const game = new GameOfLife();
      const metadata = ["x = 65, y = 65, rule = B3/S23\n"]
      const rleWriter = new RLEWriter(metadata);
      const reader = new RLEReader();
      const example = RLEReader.readFile("test/rle-files/snark-loop.rle")
      // console.log(reader.parseRLEString(example));

      const expected = "x = 65, y = 65, rule = B3/S23\n" +
        "27b2o$27bobo$29bo4b2o$25b4ob2o2bo2bo$25bo2bobobobob2o$28bobobobo$29b2o" +
        "bobo$33bo2$19b2o$20bo7b2o$20bobo5b2o$21b2o3$35bobo$26b2o8b2o$25bobo8b" +
        "o$27bo$31b2o22bo$31bo21b3o$32b3o17bo$34bo17b2o3$47bo12b2o$48bo12bo$3b" +
        "2o10b2o29b3o12bob2o$4bo11b2o35b2o4b3o2bo$2bo12bo37b2o3bo3b2o$2b5o14b2o" +
        "35b4o$7bo13bo22b2o15bo$4b3o12bobo21bobo12b3o$3bo15b2o22bo13bo$3b4o35b" +
        "2o14b5o$b2o3bo3b2o37bo12bo$o2b3o4b2o35b2o11bo$2obo12b3o29b2o10b2o$3bo" +
        "12bo$3b2o12bo3$11b2o17bo$12bo17b3o$9b3o21bo$9bo22b2o$37bo$28bo8bobo$27b" +
        "2o8b2o$27bobo3$42b2o$35b2o5bobo$35b2o7bo$44b2o2$31bo$30bobob2o$30bobo" +
        "bobo$27b2obobobobo2bo$27bo2bo2b2ob4o$29b2o4bo$35bobo$36b2o!";

      const result = await game.readAndOutputGeneration("test/rle-files/snark-loop.rle", 1);
      // console.log("Result:");
      // console.log(result.split("$"));
      const finalResult = rleWriter.removeTrailingDeadCells(result);
      // console.log(finalResult);
      const result1 = rleWriter.compressRepeatedLines(finalResult);

      const expectedLines = expected.split("$");
      const finalResultLines = result1.split("$");
      // const finalResultLines = finalResult.split("$");
      console.log(expected.length);
      console.log(finalResult.length);
      expect(finalResultLines).to.equal(expectedLines);

      expect(result1).toEqual(expected);
    })

    // test that snarkloop will be return properly with no evolution
    test("should return snark loop rle with no evolution", () => {
      const reader = new RLEReader()
      const string = RLEReader.readFile("test/rle-files/snark-loop.rle")
      const expected = "x = 65, y = 65, rule = B3/S23\n" +
        "27b2o$27bobo$29bo4b2o$25b4ob2o2bo2bo$25bo2bo3bobob2o$28bobobobo$29b2o\n" +
        "bobo$33bo2$19b2o$20bo8bo$20bobo5b2o$21b2o$35bo$36bo$34b3o2$25bo$25b2o\n" +
        "$24bobo4b2o22bo$31bo21b3o$32b3o17bo$34bo17b2o2$45bo$46b2o12b2o$45b2o14b\n" +
        "o$3b2o56bob2o$4bo9b2o37bo5b3o2bo$2bo10bobo37b2o3bo3b2o$2b5o8bo5b2o35b\n" +
        "2obo$7bo13bo22b2o15bo$4b3o12bobo21bobo12b3o$3bo15b2o22bo13bo$3bob2o35b\n" +
        "2o5bo8b5o$b2o3bo3b2o37bobo10bo$o2b3o5bo37b2o9bo$2obo56b2o$3bo14b2o$3b\n" +
        "2o12b2o$19bo2$11b2o17bo$12bo17b3o$9b3o21bo$9bo22b2o4bobo$38b2o$39bo2$\n" +
        "28b3o$28bo$29bo$42b2o$35b2o5bobo$35bo8bo$44b2o2$31bo$30bobob2o$30bobo\n" +
        "bobo$27b2obobo3bo2bo$27bo2bo2b2ob4o$29b2o4bo$35bobo$36b2o!";

      expect(string).toEqual(expected);
    })

    //convert to grid, then back to rle
    test("", () => {

    })

    // find more shapes to test

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
    test.skip("lobster", async () => {
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

        expect(result).toEqual(expected);
    })

    // test that lobster will be return properly with no evolution
  })
})
