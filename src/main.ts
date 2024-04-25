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

// add arguments after 'npm start'