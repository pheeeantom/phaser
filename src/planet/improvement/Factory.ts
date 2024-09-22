import { PlanetScene } from "../../scenes/PlanetScene";
import { Profitable } from "../../interfaces/Profitable";
import { LandImprovement } from "./LandImprovement";
import { Country } from "../../country/Country";

export class Factory extends LandImprovement implements Profitable {
    static readonly cost: number = 18;
    static readonly acceptableTerrains: number[] = [2, 4];
    constructor() {
        super();
        this.terrainTypeId = 14;
    }

    income(): number {
        return 7;
    }
}