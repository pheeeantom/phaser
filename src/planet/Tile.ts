import { Improvement } from "./improvement/Improvement";
import { Tiles } from "./Tiles";

//constructor function to create all the grid points as objects containind the data for the points
export class Tile {
    x: number;
    y: number;
    f: number;
    g: number;
    h: number;
    terrainTypeId: number;
    movementCost: number;
    water: boolean;
    neighbors: Tile[];
    parent: Tile | undefined;
    improvement: Improvement | null;
    constructor(x: number, y: number, terrainTypeId: number, movementCost: number, water: boolean) {
        this.x = x; //x location of the grid point
        this.y = y; //y location of the grid point
        this.f = 0; //total cost function
        this.g = 0; //cost function from start to the current grid point
        this.h = 0; //heuristic estimated cost function from current grid point to the goal
        this.neighbors = []; // neighbors of the current grid point
        this.parent = undefined; // immediate source of the current grid point

        this.terrainTypeId = terrainTypeId;
        this.movementCost = movementCost;
        this.water = water;
    }
    
  
    // update neighbors array for a given grid point
    updateNeighbors(grid: Tile[][], cols: number, rows: number) {
      let i = this.x;
      let j = this.y;
      if (i < cols - 1) {
        this.neighbors.push(grid[i + 1][j]);
      }
      if (i > 0) {
        this.neighbors.push(grid[i - 1][j]);
      }
      if (j < rows - 1) {
        this.neighbors.push(grid[i][j + 1]);
      }
      if (j > 0) {
        this.neighbors.push(grid[i][j - 1]);
      }
    };
  }