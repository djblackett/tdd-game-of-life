export class GameOfLife {
  width = -1;
  height = -1


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

  }

}





const glider =
  `#N Glider
#O Richard K. Guy
#C The smallest, most common, and first discovered spaceship. Diagonal, has period 4 and speed c/4.
#C www.conwaylife.com/wiki/index.php?title=Glider
x = 3, y = 3, rule = B3/S23
bob$2bo$3o!`