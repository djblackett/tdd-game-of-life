import { GameOfLife } from "./GameOfLife";

const start = async () => {
  if (process.argv.length === 4) {
    const filepath = process.argv[2];
    const generations = process.argv[3]

    const game = new GameOfLife();
    const output = await game.endToEnd(filepath, parseInt(generations));
    console.log(output);
  } else {
    console.log("Please add filepath and # of generations as arguments");
  }
}

start();

// examples for manual testing/demonstration

// Gosper Gun after 3 generations
// npm start test/rle-files/gosper-gun.rle 3

const result = "x = 36, y = 9, rule = B3/S23\n" +
  "22bo$21bobo$11b2o6b2o3bo9b2o$10bobo4b2obo3bo9b2o$2o7b3o4b3obo3bo$2o6b\n" +
  "3o4bo2b2obobo$9b3o4b2o4bo$10bobo$11b2o!\n"

const expected = "x = 36, y = 9, rule = B3/S23\n" +
"22bo$21bobo$11b2o6b2o3bo9b2o$10bobo4b2obo3bo9b2o$2o7b3o4b3obo3bo$2o6b\n" +
"3o4bo2b2obobo$9b3o4b2o4bo$10bobo$11b2o!\n"

console.log("Gosper Gun:", result === expected);