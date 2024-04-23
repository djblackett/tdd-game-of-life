import fs from "node:fs";

export class RLEReader {
  metadata: string[] = []

  getMetadata() {
    return this.metadata;
  }

  static readFile(url: string) {
    try {
      const input = fs.readFileSync(url, { encoding: 'utf8' })
      if (input) {
        return input.trim().replaceAll("\r", "");
      }
      throw new Error()
    } catch (e) {
      console.error(e);
      throw new Error("Error reading RLE file!")
    }
  }

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
      let tempGrid: string[][] = [];

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
        tempGrid.push(fullLine.split(""))

        if (endDigits) {
          const digits = parseInt(endDigits);

          for (let i = 0; i < digits - 1; i++) {
            tempGrid.push("b".repeat(parseInt(x)).split(""));
          }
        }
      }
      return tempGrid;
    } else {
      throw new Error("RLE string could not be parsed");
    }
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