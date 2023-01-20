import Graph from "./graph.js";

export class Node {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.cost = 0;
    this.parent = null;
    this.east = null;
    this.south = null;
    this.west = null;
    this.north = null;
    this.heuristic = 0;
  }

  checkEquality(x, y) {
    return x === this.x && y === this.y;
  }

  toString() {
    return `[${this.x}, ${this.y}]`;
  }
}

export class Path {
  nodes = []; // Keeping all nodes in a list to prevent duplicate nodes.
  graph = null;
  constructor() {
    // Creating the path.
    this.graph = new Graph();
    this.root = this.createNode(this.graph.start[0], this.graph.start[1]);
    // Finding maximum depth.
    this.maximumDepth = this.findMaximumDepth() - 1;

    // Creating heuristic...
    this.createHeuristic();

    // We will make the cost of root node 0, because that's where we start.
    this.root.cost = 0;
  }

  createNode(x, y) {
    const node = new Node();

    // Initializing node's coordinates.
    node.x = x;
    node.y = y;

    // Adding the node into the nodes list.
    this.nodes.push(node);

    // Setting the cost 1 if it is not a trap square.
    node.cost = this.graph.traps[node.x][node.y] === 1 ? 7 : 1;

    // Setting all child nodes.
    if (this.graph.canPass(node.x, node.y, "east")) {
      // Before creating a new node, we should check if that node exists. If yes, we don't need to create it.
      node.east = this.nodeExists(node.x, node.y + 1);
      if (node.east == null) {
        node.east = this.createNode(node.x, node.y + 1);
        node.east.parent = node;
      }
    }

    if (this.graph.canPass(node.x, node.y, "south")) {
      node.south = this.nodeExists(node.x + 1, node.y);
      if (node.south == null) {
        node.south = this.createNode(node.x + 1, node.y);
        node.south.parent = node;
      }
    }

    if (this.graph.canPass(node.x, node.y, "west")) {
      node.west = this.nodeExists(node.x, node.y - 1);
      if (node.west == null) {
        node.west = this.createNode(node.x, node.y - 1);
        node.west.parent = node;
      }
    }

    if (this.graph.canPass(node.x, node.y, "north")) {
      node.north = this.nodeExists(node.x - 1, node.y);
      if (node.north == null) {
        node.north = this.createNode(node.x - 1, node.y);
        node.north.parent = node;
      }
    }

    return node;
  }

  nodeExists(x, y) {
    return this.nodes.find((node) => node.checkEquality(x, y)) || null;
  }

  findMaximumDepth() {
    let maximumDepth = 0;

    this.nodes.forEach((node) => {
      let currentNode = node;
      let localDepth = 0;
      while (currentNode) {
        currentNode = currentNode.parent;
        localDepth += 1;
      }

      maximumDepth = Math.max(maximumDepth, localDepth);
    });

    return maximumDepth;
  }

  getNodeCost(x, y) {
    const node = this.nodes.find((node) => node.checkEquality(x, y));
    return node ? node.cost : 0;
  }

  clearParents() {
    this.nodes.forEach((node) => {
      node.parent = null;
    });
  }

  createHeuristic() {
    // Create a heuristic for each node...
    for (const node of this.nodes) {
      // Select minimum distance to a closest goal...
      let totalCost = Number.MAX_SAFE_INTEGER;
      for (const goal of this.graph.goals) {
        let cost = 0;
        let verticalDistance = goal[1] - node.y;
        let horizontalDistance = goal[0] - node.x;

        // Then we will add each node's cost until to the goal state...
        let x = 0;
        let y = 0;
        while (verticalDistance > 0) {
          y += 1;
          cost += this.getNodeCost(node.x, node.y + y);
          verticalDistance -= 1;
        }
        while (horizontalDistance > 0) {
          x += 1;
          cost += this.getNodeCost(node.x + x, node.y + y);
          horizontalDistance -= 1;
        }
        while (verticalDistance < 0) {
          y -= 1;
          cost += this.getNodeCost(node.x + x, node.y + y);
          verticalDistance += 1;
        }
        while (horizontalDistance < 0) {
          x -= 1;
          cost += this.getNodeCost(node.x + x, node.y + y);
          horizontalDistance += 1;
        }

        // Select the minimum heuristic...
        totalCost = Math.min(totalCost, cost);
      }

      // After calculating the total cost, we assign it into node's heuristic...
      node.heuristic = totalCost;
    }
  }
}
