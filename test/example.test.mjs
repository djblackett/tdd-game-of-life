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

export const gliderGunGrid =[
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

    test("should parse an rle file that contains line multipliers", () => {
      const inputString = "x = 3, y = 4, rule = B3/S23\nbo$2bo2$3o!"
      const expected = [
        ["b", "o", "b"],
        ["b", "b", "o"],
        ["b", "b", "o"],
        ["o", "o", "o"]
      ];
      const game = new GameOfLife();
      const result = game.parseRLEString(inputString);
      expect(result).to.deep.equal(expected);
    })

    test("should parse a multi line rle file and return as a matrix", () => {
      const game = new GameOfLife();

      const result = game.parseRLEString("x = 36, y = 9, rule = B3/S23\n" +
        "24bo$22bobo$12b2o6b2o12b2o$11bo3bo4b2o12b2o$2o8bo5bo3b2o$2o8bo3bob2o4b\n" +
        "obo$10bo5bo7bo$11bo3bo$12b2o!");

      expect(result).to.deep.equal(gliderGunGrid);
    });

    test("should repeat lines when an rle line has a number at the end", () => {
      const game = new GameOfLife();
      const input = "x = 26, y = 6, rule = B3/S23\n" + "24bo$22o$5b7o3$2o!";
      const expected = "x = 26, y = 6, rule = B3/S23\n" + "24bo$22o$5b7o3$2o!"
      const grid = game.parseRLEString(input);
      let result = game.outputFullRLE(grid, grid.length, grid[0].length);
      result = game.addRepeatedLines(result);
      result = game.removeTrailingDeadCells(result)
      result = game.compressRepeatedLines(result)
      expect(result).toEqual(expected)
    })

    test("should output the matrix as an RLE string", () => {
      const game = new GameOfLife();
      const shape = game.parseRLEString(glider);
      const result = game.outputRLE(shape, shape.length, shape[0].length);
      expect(result).to.deep.equal("bob$2bo$3o!");
    })

    test("should read string from RLE file", async () => {
      const expected = `#N Glider
#O Richard K. Guy
#C The smallest, most common, and first discovered spaceship. Diagonal, has period 4 and speed c/4.
#C www.conwaylife.com/wiki/index.php?title=Glider
x = 3, y = 3, rule = B3/S23
bob$2bo$3o!`

      const result = GameOfLife.readFile("test/glider.rle");
      expect(result).to.deep.equal(expected);
    });

    test("should return pattern in rle format including metadata", () => {
      const game = new GameOfLife();
      const shape = game.parseRLEString(glider);
      const result = game.outputFullRLE(shape,shape.length, shape[0].length);
      expect(result).to.deep.equal(glider);
    });

    test("should remove explicitly set empty cells at end of line in RLE string", () => {
      const game = new GameOfLife()
      const inputString = [  ["b", "o", "b"],
        ["b", "b", "o"],
        ["o", "o", "o"]]
      const expected = "bo$2bo$3o!";
      const result = game.outputRLE(inputString, 3, 3);
      const finalResult = game.removeTrailingDeadCells(result)
      expect(finalResult).toEqual(expected)
    })
  })

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
      console.log(isolatedShape)
      expect(isolatedShape).to.deep.equal([["o"], ["o"], ["o"]])


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

      const result = await game.readAndOutputGeneration("test/glider.rle", 3);
      expect(result).toEqual(expected);
    })

    test("should work end to end for block shape", async () => {
      const game = new GameOfLife();
      const expected = "#N Block\n#C An extremely common 4-cell still life.\n#C www.conwaylife.com/wiki/index.php?title=Block\nx = 2, y = 2, rule = B3/S23\n2o$2o!"

      const result = await game.readAndOutputGeneration("test/block.rle", 3);
      expect(result).toEqual(expected);
    });

    test("should work end to end for gosper gun shape, 3 generations", async () => {
      const game = new GameOfLife();
      const expected =  "x = 36, y = 9, rule = B3/S23\n" +
        "22bo$21bobo$11b2o6b2o3bo9b2o$10bobo4b2obo3bo9b2o$2o7b3o4b3obo3bo$2o6b" +
        "3o4bo2b2obobo$9b3o4b2o4bo$10bobo$11b2o!"


      const result = await game.readAndOutputGeneration("test/gosper-gun.rle", 3);
      const finalResult = game.removeTrailingDeadCells(result);
      expect(finalResult).toEqual(expected);
    });

    // come back to this later
    test.skip("should output correct rle for snark loop, 1 generation", async () => {
      const game = new GameOfLife();
      const expected = "x = 65, y = 65, rule = B3/S23\n" +
        "27b2o$27bobo$29bo4b2o$25b4ob2o2bo2bo$25bo2bobobobob2o$28bobobobo$29b2o" +
        "bobo$33bo2$19b2o$20bo7b2o$20bobo5b2o$21b2o3$35bobo$26b2o8b2o$25bobo8b" +
        "o$27bo$31b2o22bo$31bo21b3o$32b3o17bo$34bo17b2o3$47bo12b2o$48bo12bo$3b" +
        "2o10b2o29b3o12bob2o$4bo11b2o35b2o4b3o2bo$2bo12bo37b2o3bo3b2o$2b5o14b2o" +
        "35b4o$7bo13bo22b2o15bo$4b3o12bobo21bobo12b3o$3bo15b2o22bo13bo$3b4o35b" +
        "2o14b5o$b2o3bo3b2o37bo12bo$o2b3o4b2o35b2o11bo$2obo12b3o29b2o10b2o$3bo" +
        "12bo$3b2o12bo3$11b2o17bo$12bo17b3o$9b3o21bo$9bo22b2o$37bo$28bo8bobo$27b" +
        "2o8b2o$27bobo3$42b2o$35b2o5bobo$35b2o7bo$44b2o2$31bo$30bobob2o$30bobo" +
        "bobo$27b2obobobobo2bo$27bo2bo2b2ob4o$29b2o4bo$35bobo$36b2o!"

      const result = await game.readAndOutputGeneration("test/snark-loop.rle", 1);
      console.log("Result:");
      console.log(result.split("$"));
      const finalResult = game.removeTrailingDeadCells(result);
      // console.log(finalResult);
      // const reallyFinal = game.addRepeatedLines(finalResult)
      const result1 = game.compressRepeatedLines(finalResult);

      const expectedLines = expected.split("$");
      const finalResultLines = result1.split("$");
      // const finalResultLines = finalResult.split("$");


      // expect(finalResultLines).to.equal(expectedLines);
      // console.log(expected.length);
      // console.log(finalResult.length);
      expect(result1).toEqual(expected);
    })

    // find more shapes to test

// need to check list for duplicates rows and then compress them and use the end digits
// do the numbers at the end actually mean a blank row is next?

test.skip("blinker", async () => {
  const expected = "#N Blinker\n" +
    "#O John Conway\n" +
    "#C A period 2 oscillator that is the smallest and most common oscillator.\n" +
    "#C www.conwaylife.com/wiki/index.php?title=Blinker\n" +
    "x = 3, y = 1, rule = B3/S23\n" +
    "o$o$o!";

  const result = await game.readAndOutputGeneration("test/blinker.rle", 1);
  const finalResult = game.removeTrailingDeadCells(result);
  expect(finalResult).toEqual(expected);
});
  })
})
