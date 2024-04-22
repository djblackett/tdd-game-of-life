export class RLEWriter {
  metadata;

  constructor(metadata: string[] = []) {
    this.metadata = metadata;
  }

  outputRLE(shape: string[][]) {
    const charArr = [];
    for (let i = 0; i < shape.length; i++) {
      let str = "";
      let count = 1;
      let isRun = false;

      for (let j = 0; j < shape[0].length; j++) {
        let char = shape[i][j];
        let char2 = shape[i][j + 1];

        if (char === char2) {
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
    // return this.shortenRLEString(charArr.join("$") + "!");
    return charArr.join("$") + "!"
  }

  outputFullRLE(shape: string[][]) {
    let str = this.metadata.join("\n");
    str += "\n" + this.outputRLE(shape);
    return str;
  }

  shortenRLEString(rle: string) {
    const stringArr = rle.split("\n");
    const encodedLinesOnly: string[] = []
    for (let line of stringArr) {
      if (!line.startsWith("#") && !line.startsWith("x")) {
        encodedLinesOnly.push(line);
      }
    }

    rle = encodedLinesOnly.join("\n");

    if (rle.length <= 70) {
      return rle
    }

    let shortened = ""
    while (rle.length > 70) {
      shortened += rle.substring(0, 69) + "\n";
      console.log(shortened);
      rle = rle.substring(69);
    }

    shortened += rle;
    return stringArr[0] + "\n" + shortened
  }

  removeTrailingDeadCells(rle: string) {
    const regex = /\d*b\$/g
    let fixedString = rle.replaceAll(regex, "$");
    fixedString = fixedString.replaceAll(/\d*b!$/g, "!");
    return fixedString
  }

  compressRepeatedLines(rle: string) {
    let count = 1
    let isRun = false;
    const lines = rle.split("$");
    console.log("Lines:");
    console.log(lines);
    const noRepeatsGrid: string[] = []

    for (let i = 0; i < lines.length; i++) {
      if (lines[i] === lines[i + 1]) {
        isRun = true;
        count++;
      } else if (lines[i] !== lines[i + 1] && isRun) {
        // lines.splice(i - count + 1, count, lines[i] + (count + 1).toString())
        noRepeatsGrid.push(lines[i].concat((count + 1).toString()));
        console.log(lines[i]);
        console.log(noRepeatsGrid[noRepeatsGrid.length - 1]);
        isRun = false;
        count = 1;
        // i -= count
      }
      else {
        noRepeatsGrid.push(lines[i])
      }
    }
    console.log(noRepeatsGrid);
    return noRepeatsGrid.join("$");
  }
}