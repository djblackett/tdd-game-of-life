
export class DataFormatter {
  metadata: string[] = []

  parseRLEString(input: string) {
    const lines = input.split("\n");
    let structure;
    let data = ""
    let metadata = [];

    for (let line of lines) {
      if (line.startsWith("#")) {
        this.metadata.push(line);
      }

      if (line.startsWith("x")) {
        structure = line;
        this.metadata.push(line);
      }

      if (line.charAt(0).match(/[bo\d]/)) {
        data += line;
      }
    }

    // console.log(data);
    const metaArr = structure?.split(",");
    let x;
    let y;
    if (metaArr) {
      x = metaArr[0].split("=")[1].trim();
      y = metaArr[1].split("=")[1].trim();
    }


    if (!x || !y) {
      throw new Error("Data is missing")
    }

    if (data) {
      let lines = data.split(/[$\n]/);
      let tempGrid: string[][] = [[""]];

      for (let row = 0; row < lines.length; row++) {
        let str = "";
        let runDigits = "";
        let endDigits = "";
        let isRun = false;

        let endDigitMatcher = lines[row].match(/.+(\d+)$/)
        if (endDigitMatcher) {
          endDigits = endDigitMatcher[1];
        }


        for (let char = 0; char < lines[row].length; char++) {

          // problem is here
          if (lines[row][char].match(/\d/)) {
            isRun = true;
            runDigits += lines[row][char];

          } else if (!lines[row][char].match(/\d/) && isRun) {
            isRun = false;
            str += lines[row][char].repeat(parseInt(runDigits));
            runDigits = "";
            // char++;
          } else if (lines[row][char].match("[a-z]")) {
            str += lines[row][char];
          }
        }

        let fullLine = str.padEnd(parseInt(x), "b");
        tempGrid[row] = fullLine.split("");


        if (endDigits) {
          const digits = parseInt(endDigits);

          for (let i = row; i < digits; i++) {
            lines.splice(row, 0, fullLine);
          }
        }
      }
      return tempGrid;
    } else {
      throw new Error("RLE string could not be parsed");
    }
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
    return charArr.join("$") + "!";
  }

  // todo - need metadata from argument
  outputFullRLE(shape: string[][]) {
    let str = this.metadata.join("\n");
    str += "\n" + this.outputRLE(shape);
    return str;
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

  addRepeatedLines(rle: string) {
    const arr = rle.split("$");
    for (let i = 0; i < arr.length; i++) {
      let matcher = arr[i].charAt(arr[i].length - 1).match("\d+")
      if (matcher) {
        arr[i] = (arr[i] + "$").repeat(parseInt(matcher[1]));
        arr[i] = arr[i].substring(0, arr[i].length - 1)
      }
    }
    return arr.join("$")
  }

}