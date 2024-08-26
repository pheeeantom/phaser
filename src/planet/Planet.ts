import { PlanetScene } from "../scenes/PlanetScene";
import { Soldier } from "../unit/planet/martial/land/Soldier";
import { PlanetUnit } from "../unit/planet/PlanetUnit";
import { Tiles } from "./Tiles";

export class Planet {
    name: string;
    curUnit: PlanetUnit | null;
    tiles: Tiles;
    constructor(name) {
        this.name = name;
        this.tiles = new Tiles();
    }

    initTmp(planetScene: PlanetScene) {
        this.curUnit = new Soldier();
        this.curUnit.create(7, 3, planetScene);
        this.curUnit.movementRange();
    }
}