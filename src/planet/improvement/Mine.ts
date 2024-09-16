import { PlanetScene } from "../../scenes/PlanetScene";
import { Profitable } from "../../interfaces/Profitable";
import { LandImprovement } from "./LandImprovement";
import { Country } from "../../country/Country";

export class Mine extends LandImprovement implements Profitable {
    static readonly cost: number = 3;
    static readonly acceptableTerrains: number[] = [3];
    constructor() {
        super();
        this.terrainTypeId = 13;
    }

    income(): number {
        return 2;
    }
}