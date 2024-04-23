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
    const metadata: string[] = [];

    for (let line of stringArr) {
      if (!line.startsWith("#") && !line.startsWith("x")) {
        encodedLinesOnly.push(line);
      } else {
        metadata.push(line);
      }
    }

    let text = encodedLinesOnly.join("\n");

    if (text.length <= 70) {
      return metadata.join("\n") + "\n" + text
    }

    let shortened = ""
    while (text.length > 70) {
      shortened += text.substring(0, 69) + "\n";
      text = text.substring(69);
    }

    shortened += text;
    if (shortened.endsWith("\n")) {
      shortened = shortened.substring(0, shortened.length - 1);
    }

    return metadata.join("\n") + "\n" + shortened
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
    const noRepeatsGrid: string[] = []

    for (let i = 0; i < lines.length; i++) {
      let isEmptyRow = lines[i] === "" || lines[i].match(/^b+$/);
      if (isEmptyRow) {
        isRun = true;
        count++;
      } else if (!isEmptyRow && isRun) {
        noRepeatsGrid[noRepeatsGrid.length - 1] += (count).toString()
        noRepeatsGrid.push(lines[i])
        isRun = false;
        count = 1;
      }
      else {
        noRepeatsGrid.push(lines[i])
      }
    }
    return noRepeatsGrid.join("$");
  }
}