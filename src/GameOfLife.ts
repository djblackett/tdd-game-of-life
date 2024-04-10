export class GameOfLife {
  width = -1;
  height = -1;
  startingShape = [[""]];


  parseRLEString(input: string) {
    const lines = input.split("\n");
    let metadata;
    let data;

    for (let line of lines) {
      if (line.startsWith("x")) {
        metadata = line;
      }

      if (line.endsWith("!")) {
        data = line;
      }
    }

    const metaArr = metadata?.split(",");
    let x;
    let y;
    if (metaArr) {
      x = metaArr[0].split("=")[1].trim();
      y = metaArr[1].split("=")[1].trim();
    }

    if (x && y) {
      this.width = parseInt(x);
      this.height = parseInt(y);
    }

    if (data) {
      let lines = data.split("$");
      let tempGrid = [];

      for (let row = 0; row < lines.length; row++) {
        let str = "";
        for (let char = 0; char < lines[row].length; char++) {
          if (lines[row][char].match(/\d/)) {
            str += lines[row][char + 1].repeat(parseInt(lines[row][char]));
            char++;
          } else if (lines[row][char].match("[a-z]")) {
            str += lines[row][char];
          }
        }
        tempGrid[row] = str.split("");
      }
      this.startingShape = tempGrid;
    }
  }

  outputRLE() {
    const charArr = [];
    for (let i = 0; i < this.height; i++) {
      let str = "";
      let count = 1;
      let isRun = false;

      for (let j = 0; j < this.width; j++) {
        let char = this.startingShape[i][j];
        let char2 = this.startingShape[i][j + 1];

        if ( char === char2){
          isRun = true;
          count++;
        } else if (char !== char2 && isRun) {
          str += count + char;
          isRun = false;
          count = 1;
        } else {
          str += char;
        }
      }
      charArr[i] = str;
    }
    return charArr.join("$") + "!";
  }

}


const glider =
  `#N Glider
#O Richard K. Guy
#C The smallest, most common, and first discovered spaceship. Diagonal, has period 4 and speed c/4.
#C www.conwaylife.com/wiki/index.php?title=Glider
x = 3, y = 3, rule = B3/S23
bob$2bo$3o!`


const game = new GameOfLife()
game.parseRLEString(glider);
console.log(game.outputRLE());


