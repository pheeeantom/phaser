import { PlanetScene } from "~/scenes/PlanetScene";

export class Improvement {

    x: number;
    y: number;
    population: number;
    terrainTypeId: number;
    constructor() {
        
    }

    protected place(x: number, y: number, population: number, planetScene: PlanetScene) {
        this.x = x;
        this.y = y;
        this.population = population;
        planetScene.terrainPlanetLayer.putTileAt(this.terrainTypeId, x, y);
    }
}