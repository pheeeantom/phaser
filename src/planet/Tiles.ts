import { PlanetUnit } from "~/unit/planet/PlanetUnit";
import { PlanetScene } from "../scenes/PlanetScene";
import { Tile } from "./Tile";

export class Tiles {
    grid: Tile[][];
    cols: number;
    rows: number;
    constructor() {

    }

    generateTiles(planetScene: PlanetScene) {
        let map = planetScene.terrainPlanetLayer.layer.data;
        this.grid = [];
        this.cols = map.length;
        this.rows = map[0].length;
        for (let i = 0; i < this.cols; i++) {
            this.grid.push([]);
            for (let j = 0; j < map[i].length; j++) {
                this.grid[i][j] = new Tile(i, j, map[j][i].index, map[j][i].properties.movement_cost, map[j][i].properties.water);
            }
        }
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
              this.grid[i][j].updateNeighbors(this.grid, this.cols, this.rows);
            }
        }
    }

    heuristic(position0: Tile, position1: Tile) {
        let d1 = Math.abs(position1.x - position0.x);
        let d2 = Math.abs(position1.y - position0.y);
      
        return d1 + d2;
    }

    shortestPath(start: Tile, end: Tile) {
        console.log(this.grid);
        this.clearParent();
        let openSet: Tile[] = [];
        let closedSet: Tile[] = [];
        let path: Tile[] = [];
        openSet.push(start);
        while (openSet.length > 0) {
          //assumption lowest index is the first one to begin with
          let lowestIndex = 0;
          for (let i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[lowestIndex].f) {
              lowestIndex = i;
            }
          }
          let current = openSet[lowestIndex];
      
          if (current === end) {
            let temp = current;
            path.push(temp);
            while (temp.parent) {
              path.push(temp.parent);
              temp = temp.parent;
            }
            console.log("DONE!");
            // return the traced path
            return path.reverse();
          }
      
          //remove current from openSet
          openSet.splice(lowestIndex, 1);
          //add current to closedSet
          closedSet.push(current);
      
          let neighbors = current.neighbors;
      
          for (let i = 0; i < neighbors.length; i++) {
            let neighbor = neighbors[i];
      
            if (!closedSet.includes(neighbor)) {
              let possibleG = current.g + (!neighbor.water ? neighbor.movementCost : Number.POSITIVE_INFINITY);
      
              if (!openSet.includes(neighbor)) {
                openSet.push(neighbor);
              } else if (possibleG >= neighbor.g) {
                continue;
              }
      
              neighbor.g = possibleG;
              neighbor.h = this.heuristic(neighbor, end);
              neighbor.f = neighbor.g + neighbor.h;
              neighbor.parent = current;
            }
          }
        }
      
        //no solution by default
        return [];
    }

    movementRange(unit: PlanetUnit) {
        let visitedNodes = new Map();
        const costSoFar = new Map();
        const nodesToVisitQueue: Tile[] = [];

        let startPoint = this.grid[unit.x][unit.y];
        nodesToVisitQueue.push(startPoint);
        costSoFar.set(startPoint, 0);
        visitedNodes.set(startPoint, null);

        while (nodesToVisitQueue.length > 0) {
            const currentNode = nodesToVisitQueue.shift();

            for (const neighbour of currentNode ? currentNode.neighbors : []) {
                if (!neighbour) {
                    continue;
                }

                const nodeCost = !neighbour.water ? neighbour.movementCost : Number.POSITIVE_INFINITY;
                const currentCost = costSoFar.get(currentNode);
                const newCost = currentCost + nodeCost;

                if (newCost <= unit.movementPoints) {
                    if (!visitedNodes.has(neighbour)) {
                        visitedNodes.set(neighbour, currentNode);
                        costSoFar.set(neighbour, newCost);
                        nodesToVisitQueue.push(neighbour);
                    } else if (costSoFar.get(neighbour) > newCost) {
                        costSoFar.set(neighbour, newCost);
                        visitedNodes.set(neighbour, currentNode);
                    }
                }
            }
        }

        return [...visitedNodes.keys()];
    }
      
    clearParent() {
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
              this.grid[i][j].parent = undefined;
              this.grid[i][j].f = 0;
              this.grid[i][j].g = 0;
              this.grid[i][j].h = 0;
            }
        }
    }
}