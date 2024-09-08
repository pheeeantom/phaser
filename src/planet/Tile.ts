import { PlanetScene } from "~/scenes/PlanetScene";
import { Improvement } from "./improvement/Improvement";
import { Tiles } from "./Tiles";
import { LandArmy } from "../country/LandArmy";
import { Country } from "../country/Country";
import { Soldier } from "../unit/planet/martial/land/Soldier";
import { Planet } from "./Planet";

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
    private _label: Phaser.GameObjects.Text;
    private _planet: Planet;
    constructor(x: number, y: number, terrainTypeId: number, movementCost: number, water: boolean, planet: Planet) {
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

        this._planet = planet;
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

    renderLabel(planetScene: PlanetScene, name: string, color: string) {
      this._label?.destroy();
      //let {x: pixelX, y: pixelY} = planetScene.toSceneCoordsPixels(this.x, this.y);
      //if (pixelX && pixelY) {
      this._label =
        planetScene.add.text(this.x*64, this.y*64, name,
        {color: color, backgroundColor: '#ffffff'}).setDepth(100);
      //}
    }

    tmpSpawnUnit(planetScene: PlanetScene, country: Country) {
      let curArmy = planetScene.planet.tiles.getArmyByXY(this.x, this.y);
      if (curArmy && curArmy.getUnitsNumber() + 1 > curArmy.getUnitsMaxNum()) {
        return;
      }
      let newArmy = new LandArmy();
      newArmy.create(this.x, this.y, this._planet);
      console.log(newArmy, curArmy);
      if (curArmy) {
          newArmy.addAllFromArmy(curArmy, planetScene, country.color);
          //curArmy.remove();
      }
      (country.addArmy(newArmy, planetScene) as LandArmy).addUnits([new Soldier()], planetScene, country.color);
    }
  }