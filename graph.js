import fs from "fs";

export default class Graph {
  // Variables
  size = [];
  wallVertical = [[]];
  wallsHorizontal = [[]];
  traps = [[]];
  start = [];
  goals = [];

  constructor() {
    this.readGraph();
  }

  readGraph() {
    const filePath = new URL("path.txt", import.meta.url).pathname;
    const data = fs.readFileSync(filePath, "utf8");
    const lines = data.split("\n");

    let emptyLine = 0;

    for (let i = 0; i < lines.length; i++) {
      // To be able to construct more beautiful input file, we let a blank line to be readable.
      if (!lines[i]) {
        emptyLine += 1;
      } else {
        emptyLine = 0;
      }

      if (emptyLine >= 2) {
        break;
      }
      // Now, we will check headings...
      if (lines[i] === "Size") {
        // Read the following two lines...
        const firstSize = lines[i + 1];
        const secondSize = lines[i + 2];
        this.setSize(firstSize, secondSize);
      } else if (lines[i] === "Walls") {
        const walls = [];
        i++;
        // We are going to read every line until a blank line...
        while (lines[i]) {
          walls.push(lines[i]);
          i++;
        }
        this.setWalls(walls);
      } else if (lines[i] === "Traps") {
        const traps = [];
        i++;
        // We are going to read every line until a blank line...
        while (lines[i]) {
          traps.push(lines[i]);
          i++;
        }
        this.setTraps(traps);
      } else if (lines[i] === "Start") {
        const start = lines[i + 1];
        this.setStart(start);
      } else if (lines[i] === "Goals") {
        const goals = [];
        i++;
        // We are going to read every line till a blank line...
        while (lines[i]) {
          goals.push(lines[i]);
          i++;
        }
        this.setGoals(goals);
      }
    }
  }

  // noinspection JSUnusedLocalSymbols
  setSize(x, y) {
    // First setting the row count
    if (x.includes("rows")) {
      // It is written in path.txt as "5 rows", for ex. Now, we need only the number 5 and delete other characters.
      // So we use regex to delete non-numerical characters and convert it to an integer.
      this.size.push(parseInt(x.replace(/[^0-9]/g, ""), 10));
    } else if (y.includes("rows")) {
      this.size.push(parseInt(y.replace(/[^0-9]/g, ""), 10));
    }

    // Then setting the column count
    if (x.includes("columns")) {
      this.size.push(parseInt(x.replace(/[^0-9]/g, ""), 10));
    } else if (y.includes("columns")) {
      this.size.push(parseInt(y.replace(/[^0-9]/g, ""), 10));
    }
  
    // Lastly we will fill wall and trap arrays with zero.

    /* first method
    this.wallVertical = Array.from({ length: this.size[0] }, () =>
      Array.from({ length: this.size[1] - 1 }, () => 0)
    );*/
    
    // second method
    this.wallVertical = [...Array(this.size[0])].map(() =>
      [...Array(this.size[1] - 1)].map(() => 0)
    );

    this.wallsHorizontal = [...Array(this.size[0] - 1)].map(() =>
    [...Array(this.size[1])].map(() => 0)
    );
    
    this.traps = [...Array(this.size[0])].map(() =>
    [...Array(this.size[1])].map(() => 0)
    );
  }

  setWalls(walls) {
    const wallsLength = walls.length;

    for (let i = 0; i < wallsLength; i++) {
      // First case is row...
      if (walls[i].includes("row")) {
        const rowIndex = parseInt(walls[i].replace(/[^0-9]/g, ""));
        const columnIndexes = walls[i + 1].split(" ");

        for (const index of columnIndexes) {
          this.wallVertical[rowIndex - 1][parseInt(index) - 1] = 1;
        }
        // Second case is column...
      } else if (walls[i].includes("column")) {
        const columnIndex = parseInt(walls[i].replace(/[^0-9]/g, ""));
        const rowIndexes = walls[i + 1].split(" ");
        for (const index of rowIndexes) {
          this.wallsHorizontal[parseInt(index) - 1][columnIndex - 1] = 1;
        }
      }
    }
  }

  setTraps(traps) {
    for (const trap of traps) {
      // Split the string by white spaces and convert each element to an integer using the map function
      const indexes = trap.split(" ").map(num => parseInt(num, 10));
      this.traps[indexes[0] - 1][indexes[1] - 1] = 1;
    }
  }

  setStart(start) {
    const indexes = start.split(" ").map(num => parseInt(num, 10));
    this.start.push(indexes[0] - 1, indexes[1] - 1);
  }

  setGoals(goals) {
    for (const goal of goals) {
      const indexes = goal.split(" ").map(num => parseInt(num, 10));
      const mappedIndexes = indexes.map((x) => x - 1);
      this.goals.push(mappedIndexes);
    }
  }

  canPass(row, column, direction) {
    // Check if the player can pass
    if (direction === "east") {
      return column === this.size[1] - 1
        ? false
        : this.wallVertical[row][column] === 0;
    } else if (direction === "north") {
      return row === 0 ? false : this.wallsHorizontal[row - 1][column] === 0;
    } else if (direction === "south") {
      return row === this.size[0] - 1
        ? false
        : this.wallsHorizontal[row][column] === 0;
    } else if (direction === "west") {
      return column === 0 ? false : this.wallVertical[row][column - 1] === 0;
    }
  }
}
