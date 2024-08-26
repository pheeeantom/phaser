import { PlanetScene } from "~/scenes/PlanetScene";
import { PlanetUnit } from "../../PlanetUnit";

export class Soldier extends PlanetUnit {
    name: string = "soldier";
    constructor() {
        super();
        this.movementPoints = 5;
    }
}