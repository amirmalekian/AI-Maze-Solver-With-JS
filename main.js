/**
*
* @Name: AI Maze Solver With JS
* @Author: Amirhossein Malekian
* @Repository: https://github.com/amirmalekian/AI-Maze-Solver-With-JS
* @SomeNotes:
    1- The path given in the question is modeled in the path.txt file
    2- To add elements of challenges:
        A- Traps can make a routing problem more difficult and challenging for the person navigating it, adding an extra layer of strategy and problem-solving.
        B- You can define trap problem by giving coordinates of arbitrary traps such as walls in the path.txt file.
        C- You can have multiple goals in this program.
*
**/

import {
  setPath,
  depthFirstSearch,
  iterativeDeepeningSearch,
  breathFirstSearch,
  uniformCostSearch,
  greedyBestFirstSearch,
  aStarSearch,
} from "./search.js";
import { Path } from "./path.js";

// Setting path we initiated to search class...
const path = new Path();
setPath(path);

depthFirstSearch();
iterativeDeepeningSearch();
breathFirstSearch();
uniformCostSearch();
greedyBestFirstSearch();
aStarSearch();
