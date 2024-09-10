import { PlanetUnit } from "~/unit/planet/PlanetUnit";
import { PlanetScene } from "../scenes/PlanetScene";
import { Tile } from "./Tile";
import { LandArmy } from "../country/LandArmy";
import { Army } from "../country/Army";
import { Country } from "../country/Country";
import { Planet } from "./Planet";

export class Tiles {
    private _grid: Tile[][];
    private _cols: number;
    private _rows: number;
    private _planet: Planet;
    constructor(planet: Planet) {
      this._planet = planet;
    }

    generateTiles(planetScene: PlanetScene) {
        let map = planetScene.terrainPlanetLayer.layer.data;
        this._grid = [];
        this._cols = map.length;
        this._rows = map[0].length;
        for (let i = 0; i < this._cols; i++) {
            this._grid.push([]);
            for (let j = 0; j < map[i].length; j++) {
                this._grid[i][j] = new Tile(i, j, map[j][i].index, map[j][i].properties.movement_cost, map[j][i].properties.water, this._planet);
            }
        }
        for (let i = 0; i < this._cols; i++) {
            for (let j = 0; j < this._rows; j++) {
              this._grid[i][j].updateNeighbors(this._grid, this._cols, this._rows);
            }
        }
    }

    private heuristic(position0: Tile, position1: Tile) {
        let d1 = Math.abs(position1.x - position0.x);
        let d2 = Math.abs(position1.y - position0.y);
      
        return d1 + d2;
    }

    private calcCost(neighbour: Tile, army: LandArmy, currentCost: number, maxMP: number): number {
      let armyOnTile = this.getArmyByXY(neighbour.x, neighbour.y);
      console.log(armyOnTile, army);
      let isMine = armyOnTile && Country.getCountryByArmy(armyOnTile) === Country.getCountryByArmy(army);
      let isEnemy = armyOnTile && Country.getCountryByArmy(armyOnTile) !== Country.getCountryByArmy(army)
      let nodeCost0;
      if (!neighbour.water && !armyOnTile) {
        nodeCost0 = neighbour.movementCost;
      }
      else if (!neighbour.water && armyOnTile && isMine) {
        nodeCost0 = neighbour.movementCost;
      }
      else if (!neighbour.water && armyOnTile && isEnemy) {
        nodeCost0 = /*army.getCurrentAllMovementPoints()*/maxMP > 0 ? /*army.getCurrentAllMovementPoints()*/maxMP - currentCost : Number.POSITIVE_INFINITY;
        if (nodeCost0 < neighbour.movementCost) nodeCost0 = Number.POSITIVE_INFINITY;
      }
      else {
        nodeCost0 = Number.POSITIVE_INFINITY;
      }
      console.log(currentCost, nodeCost0);
      return nodeCost0;
    }

    shortestPath(start: Tile, end: Tile, maxMP: number) {
        //console.log(this.grid);
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
            //console.log("DONE!");
            // return the traced path
            return path.reverse();
          }
      
          //remove current from openSet
          openSet.splice(lowestIndex, 1);
          //add current to closedSet
          closedSet.push(current);
      
          let neighbors = current.neighbors;
      
          //for (let i = 0; i < neighbors.length; i++) {
          //  let neighbor = neighbors[i];
          for (let neighbor of neighbors) {
      
            if (!closedSet.includes(neighbor)) {
              /*let armyOnTile = Tiles.getArmyByXY(neighbor.x, neighbor.y);
              let canUnite = armyOnTile && armyOnTile.getUnitsType() === Tiles.getArmyByXY(start.x, start.y)!.getUnitsType();
              let nodeCost0;
              if (!neighbor.water && !armyOnTile) {
                nodeCost0 = neighbor.movementCost;
              }
              else if (!neighbor.water && armyOnTile && canUnite) {
                nodeCost0 = neighbor.movementCost;
              }
              else {
                nodeCost0 = Number.POSITIVE_INFINITY
              }
              let possibleG = current.g + nodeCost0;*/

              let possibleG = current.g + this.calcCost(neighbor, this.getArmyByXY(start.x, start.y)!, current.g, maxMP);
      
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

    getMovementRange(army: LandArmy, maxMP: number): Tile[] {
        let visitedNodes = new Map();
        const costSoFar = new Map();
        const nodesToVisitQueue: Tile[] = [];

        let startPoint = army.getTile();
        nodesToVisitQueue.push(startPoint);
        costSoFar.set(startPoint, 0);
        visitedNodes.set(startPoint, null);

        while (nodesToVisitQueue.length > 0) {
            const currentNode = nodesToVisitQueue.shift();

            for (const neighbour of currentNode ? currentNode.neighbors : []) {
                if (!neighbour) {
                    continue;
                }

                /*let armyOnTile = Tiles.getArmyByXY(neighbour.x, neighbour.y);
                let canUnite = armyOnTile && armyOnTile.getUnitsType() === army.getUnitsType() &&
                  Country.getCountryByArmy(armyOnTile) === Country.getCountryByArmy(army);
                let nodeCost0;
                if (!neighbour.water && !armyOnTile) {
                  nodeCost0 = neighbour.movementCost;
                }
                else if (!neighbour.water && armyOnTile && canUnite) {
                  nodeCost0 = neighbour.movementCost;
                }
                else {
                  nodeCost0 = Number.POSITIVE_INFINITY
                }*/
                const currentCost = costSoFar.get(currentNode);
                const nodeCost = this.calcCost(neighbour, army, currentCost, maxMP);
                const newCost = currentCost + nodeCost;

                /*let maxMP: number = (army as LandArmy).getCurrentAllMovementPoints();
                if (action === "move all") {
                  maxMP = (army as LandArmy).getCurrentAllMovementPoints();
                }
                else if (action === "move one") {
                  maxMP = (army as LandArmy).getCurrentOneMovementPoints();
                }*/

                if (newCost <= maxMP) {
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
      
    private clearParent() {
        for (let i = 0; i < this._cols; i++) {
            for (let j = 0; j < this._rows; j++) {
              this._grid[i][j].parent = undefined;
              this._grid[i][j].f = 0;
              this._grid[i][j].g = 0;
              this._grid[i][j].h = 0;
            }
        }
    }

  /*getArmyByXYAndCountry(x: number, y: number, country: Country) {
    return country ? this.getArmy(x, y, country.armies) : null;
  }

  getImprovementByXYAndCountry(x: number, y: number, country: Country) {
    return country ? this.getImprovement(x, y, country.tiles) : null;
  }*/

  getArmyByXY(x: number, y: number) {
    let pile = Country.allArmies();
    return this.getArmy(x, y, pile);
  }

  getImprovementByXY(x: number, y: number) {
    let pile = Country.allTiles();
    console.log(x, y, pile);
    return this.getImprovement(x, y, pile);
  }

  private getArmy(x: number, y: number, pile: Army[]) {
    return pile.filter(
      (army) => army instanceof LandArmy
    ).find((army) => {
      return army.getTile() === this.getTileByXY(x, y);
    }) ?? null;
  }

  private getImprovement(x: number, y: number, pile: Tile[]) {
    console.log(x, y, pile);
    let tile = pile.find((tile) => {
      return tile.x === x && tile.y === y;
    });
    return tile ? tile.improvement : null;
  }

  getTileByXY(x: number, y: number): Tile {
    return this._grid[x][y];
  }

  static getNamesOfTerrains(terrainTypeIdArr: number[]): string[] {
    return terrainTypeIdArr.map((terrainTypeId) => {
      if (terrainTypeId === 1) {
        return "desert";
      }
      if (terrainTypeId === 2) {
        return "grassland";
      }
      if (terrainTypeId === 3) {
        return "mountains";
      }
      if (terrainTypeId === 4) {
        return "plains";
      }
      if (terrainTypeId === 5) {
        return "snow";
      }
      if (terrainTypeId === 6) {
        return "tundra";
      }
      if (terrainTypeId === 7) {
        return "water";
      }
      if (terrainTypeId === 8) {
        return "city";
      }
      if (terrainTypeId === 9) {
        return "village";
      }
      if (terrainTypeId === 10) {
        return "town";
      }
      if (terrainTypeId === 11 || terrainTypeId === 12) {
        return "farm";
      }
      if (terrainTypeId === 13) {
        return "mine";
      }
    }) as string[];
  }
}