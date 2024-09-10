import { PlanetScene } from "../../scenes/PlanetScene";
import { Profitable } from "../../interfaces/Profitable";
import { LandImprovement } from "./LandImprovement";
import { Country } from "../../country/Country";

export class Farm extends LandImprovement implements Profitable {
    static cost: number = 3;
    static acceptableTerrains: number[] = [2, 4];
    private _income: number;
    constructor() {
        super();
        //this.terrainTypeId = 10;
    }

    income(): number {
        return this._income;
    }

    override place(x: number, y: number, population: number, planetScene: PlanetScene, name: string, country: Country) {
        if (planetScene.planet.tiles.getTileByXY(x, y).terrainTypeId === 2) {
            this.terrainTypeId = 11;
            this._income = 2;
        }
        else if (planetScene.planet.tiles.getTileByXY(x, y).terrainTypeId === 4) {
            this.terrainTypeId = 12;
            this._income = 1;
        }
        super.place(x, y, population, planetScene, name, country);
    }
}