import { PlanetScene } from "~/scenes/PlanetScene";
import { PlanetUnit } from "../../PlanetUnit";

export class Tank extends PlanetUnit {
    static cost: number = 20;
    constructor() {
        super();
        this.movementPoints = 8;
        this.currentMovementPoints = this.movementPoints;
        this.name = "tank";
        this.meleeAttackDice = "1d12";
        this.maxNum = 2;
    }
}