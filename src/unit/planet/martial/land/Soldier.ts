import { PlanetScene } from "~/scenes/PlanetScene";
import { PlanetUnit } from "../../PlanetUnit";

export class Soldier extends PlanetUnit {
    constructor() {
        super();
        this.movementPoints = 5;
        this.name = "soldier";
        this.meleeAttackDice = "1d6";
    }
}