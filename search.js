// GLOBAL VARIABLES
let path = null;
export const getPath = () => path;
export const setPath = (newPath) => (path = newPath);
let frontier = [];
let visited = new Map(); // To prevent duplicates, we use OrderedDict

export function depthFirstSearch() {
  path.clearParents();
  DFS_BFS_IDS_UCS("Depth First Search(DFS):");
}

export function breathFirstSearch() {
  path.clearParents();
  DFS_BFS_IDS_UCS("Breath First Search(BFS):");
}

export function iterativeDeepeningSearch() {
  path.clearParents();
  DFS_BFS_IDS_UCS("Iterative Deepening Search(IDS):");
}

export function uniformCostSearch() {
  path.clearParents();
  DFS_BFS_IDS_UCS("Uniform Cost Search(UCS):");
}

export function greedyBestFirstSearch() {
  path.clearParents();
  heuristicSearch("Greedy Best First Search(GBFS):", returnHeuristic);
}

export function aStarSearch() {
  path.clearParents();
  heuristicSearch("A Star Search(A*):", returnCostAndHeuristic);
}

function heuristicSearch(algorithm, sortBy) {
  // Variables
  let goalState = null;
  // Lets clear frontier and visited, then add root element to the frontier.
  frontier.splice(0, frontier.length);
  visited.clear();
  frontier.push(path.root);

  while (frontier.length > 0) {
    // Firstly, we need to sort the frontier according to heuristic...
    sortFrontier(sortBy);

    // We need to remove the correct node from the frontier and add it to the visited.
    let currentNode = frontier.shift();
    visited.set(currentNode, null);

    // Stop GBFS, if we are in a goal state...
    if (isGoal(currentNode)) {
      goalState = currentNode;
      break;
    }

    // Add to frontier as in BFS.
    addToFrontier(currentNode, "BFS");
  }

  // Check if GBFS was successful...
  if (goalState !== null) {
    // We need to calculate the cost of the solution AND get the solution itself...
    let current = goalState;
    let solutionCost = 0;
    let solution = [];

    while (current !== null) {
      solutionCost += current.cost;
      solution.unshift(current);
      // Get the parent node and continue...
      current = current.parent;
    }

    // Print the results...
    printResults(algorithm, solutionCost, solution, visited);
  } else {
    console.log("No goal state found.");
  }
}

function DFS_BFS_IDS_UCS(algorithm) {
  // Variables
  let popIndex = 0;
  let goalState = null;
  let solutionCost = 0;
  let solution = [];
  let expandedNodes = [];
  let iteration = -1;

  // DFS_BFS_IDS
  while (goalState === null && iteration <= path.maximumDepth) {
    // For each iteration, we will increase iteration by one and clear frontier and visited. Also append root node.
    iteration += 1;
    frontier.length = 0;
    visited.clear();
    frontier.push(path.root);

    // If IDS, we will add iteration number...
    if (algorithm.includes("IDS")) {
      expandedNodes.push(`Iteration ${iteration}:`);
    }

    while (frontier.length > 0) {
      // If DFS or IDS, we will remove last node from the frontier.
      // IF BFS, we will remove the first node from the frontier.
      if (algorithm.includes("DFS") || algorithm.includes("IDS")) {
        popIndex = frontier.length - 1;
      }

      // IF UCS, we need to sort the frontier according to cost...
      if (algorithm.includes("UCS")) {
        sortFrontier(returnCost);
      }

      // We need to remove the correct node from the frontier according to the algorithm and add it to the visited.
      const currentNode = frontier.splice(popIndex, 1)[0];
      visited.set(currentNode, null);

      // Stop DFS_BFS_IDS, if we are in a goal state...
      if (isGoal(currentNode)) {
        goalState = currentNode;
        break;
      }

      // Lets add all child nodes of the current element to the end of the list...
      // If IDS, we need to add child nodes according to the iteration number.
      if (algorithm.includes("IDS")) {
        let parent = currentNode;
        for (let i = 0; i < iteration; i++) {
          // If parent is not none, iterate to upper parent.
          parent = parent === null ? null : parent.parent;
        }

        if (parent === null) {
          addToFrontier(currentNode, "DFS");
        }
      } else {
        addToFrontier(currentNode, algorithm);
      }

      // Add all visited nodes to expanded nodes, before clearing it.
      for (let node of visited.keys()) {
        expandedNodes.push(node);
      }

      // We will continue only if this is an IDS search...
      if (!algorithm.includes("IDS")) {
        break;
      }
    }

    // Check if DFS_BFS_IDS was successful...
    if (goalState === null) {
      console.log("No goal state found.");
      return;
    }

    // We need to calculate the cost of the solution AND get the solution itself...
    let current = goalState;
    while (current !== null) {
      solutionCost += current.cost;
      solution.unshift(current);
      // Get the parent node and continue...
      current = current.parent;
    }

    // Print the results...
    printResults(algorithm, solutionCost, solution, expandedNodes);
  }
}

function addToFrontier(currentNode, algorithm) {
  // If the child nodes are not null AND if they are not in visited, we will add them to the frontier.
  const nodesToAdd = [];
  if (currentNode.east !== null && !isInVisited(currentNode.east)) {
    nodesToAdd.push(setParent(currentNode, currentNode.east, algorithm));
  }
  if (currentNode.south !== null && !isInVisited(currentNode.south)) {
    nodesToAdd.push(setParent(currentNode, currentNode.south, algorithm));
  }
  if (currentNode.west !== null && !isInVisited(currentNode.west)) {
    nodesToAdd.push(setParent(currentNode, currentNode.west, algorithm));
  }
  if (currentNode.north !== null && !isInVisited(currentNode.north)) {
    nodesToAdd.push(setParent(currentNode, currentNode.north, algorithm));
  }

  // For DFS we'll do it in reverse order because we add each node to the end and EAST should be the last node.
  // For BFS we'll do it in correct order.
  if (algorithm.includes("DFS")) {
    nodesToAdd.reverse();
  }

  // Then add each node to the frontier.
  nodesToAdd.forEach((node) => frontier.push(node));
}

function setParent(parentNode, childNode, algorithm) {
  // We need to set the parent node it is None and if DFS is used.
  if (algorithm.includes("DFS") || childNode.parent === null) {
    childNode.parent = parentNode;
  }
  return childNode;
}

function isInVisited(node) {
  return visited.has(node);
}

function isGoal(node) {
  return path.graph.goals.some(
    (goal) => goal[0] === node.x && goal[1] === node.y
  );
}

function printResults(algorithm, solutionCost, solution, expandedNodes) {
  console.log(`Cost of the solution: ${solutionCost}`);
  console.log(`The solution path (${solution.length} nodes):`);
  for (const node of solution) {
    console.log(node);
  }
  console.log(`\nExpanded nodes (${expandedNodes.length} nodes):`);
  if (algorithm.includes("IDS")) {
    console.log();
    for (let i = 0; i < expandedNodes.length - 1; i++) {
      if (typeof expandedNodes[i + 1] === "string") {
        console.log(expandedNodes[i]);
      } else {
        console.log(expandedNodes[i]);
      }
    }
  } else {
    for (const node of expandedNodes) {
      console.log(node);
    }
  }
  console.log("\n");
}

function returnCost(node) {
  return node.cost;
}

function returnHeuristic(node) {
  return node.heuristic;
}

function returnCostAndHeuristic(node) {
  return node.heuristic + node.cost;
}

function sortFrontier(sortBy) {
  frontier.sort((a, b) => sortBy(a) - sortBy(b));
}
