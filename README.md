# AI-Maze-Solver-With-JS
With the use of various search algorithms like BFS, DFS, A* (A-Star), etc., this application can navigate a 2D maze. It performs each search method using an input file containing various types of maze-related information, allowing you to compare and contrast the results of each approach.

Before creating the maze, the application first scans the input file you provided. The following information must be present in the input file:
- The size of the maze (number of rows and columns)
- The wall position of the maze
- The Trap position of the maze
- The starting position of the maze
- The goal position of the maze

The program then begins to search the maze using the algorithms it contains. Following the algorithm's completion, a list of expanded nodes, the solution path itself, and the cost of the solution are printed. The algorithms that make up the software itself are listed below:

- Depth-First Search (DFS)
- Breath-First Search (BFS)
- Iterative-Deepening Search (IDS)
- Uniform-Cost Search (UCS)
- Greedy-Best-First Search (GBFS)
- A-Star Search (A*)

The algorithms Greedy-Best-First Search and A-Star Search employ a program-generated admissible heuristic.