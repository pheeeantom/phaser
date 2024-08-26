import { PlanetScene } from "~/scenes/PlanetScene";
import { Soldier } from "../unit/planet/martial/land/Soldier";
import { PlanetUnit } from "../unit/planet/PlanetUnit";

export class Planet {
    name: string;
    curUnit: PlanetUnit | null;
    constructor(name) {
        this.name = name;
    }

    initTmp(planetScene: PlanetScene) {
        this.curUnit = new Soldier();
        this.curUnit.create(7, 3, planetScene);
    }
}