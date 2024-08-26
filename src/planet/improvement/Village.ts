import { PlanetScene } from "~/scenes/PlanetScene";
import { Improvement } from "./Improvement";

export class Village extends Improvement {
    constructor() {
        super();
        this.terrainTypeId = 9;
    }

    place(x: number, y: number, population: number, planetScene: PlanetScene): void {
        super.place(x, y, population, planetScene);
        planetScene.planet.tiles.grid[x][y].improvement = this;
    }
}