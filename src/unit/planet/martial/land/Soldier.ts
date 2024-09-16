import { PlanetScene } from "~/scenes/PlanetScene";
import { PlanetUnit } from "../../PlanetUnit";

export class Soldier extends PlanetUnit {
    static readonly cost: number = 5;
    constructor() {
        super();
        this.movementPoints = 5;
        this.currentMovementPoints = this.movementPoints;
        this.name = "soldier";
        this.meleeAttackDice = "1d6";
        this.maxNum = 8;
    }
}